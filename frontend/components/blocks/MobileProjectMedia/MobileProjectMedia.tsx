import styled from 'styled-components';
import {
	CaseStudyType,
	ClientType,
	CroppedSlideType,
	FullBleedSlideType,
	RepresentationType
} from '../../../shared/types/types';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useRef } from 'react';
import MediaStack from '../../common/MediaStack';
import { useRouter } from 'next/router';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';

type Props = {
	setActiveSlideIndex?: (index: number) => void;
	data: (
		| ClientType
		| RepresentationType
		| CaseStudyType
		| FullBleedSlideType
		| CroppedSlideType
	)[];
	nextProjectGalleryBlocks: (any | any)[];
	activeSlideIndex: number;
	nextProjectSlug: string;
	type: 'case-studies' | 'representation';
};

const MobileProjectMediaWrapper = styled.div`
	display: none;

	@media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
		display: block;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100dvh;
		z-index: 50;
		display: flex;
		justify-content: center;
		align-items: center;
	}
`;

const Embla = styled.div`
	height: 100%;
	width: 100%;
`;

const EmblaContainer = styled.div`
	width: 100%;
	height: 100%;
`;

const EmblaSlide = styled.div`
	height: 100dvh;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const CroppedProjectWrapper = styled.div<{ $usePortrait: boolean }>`
	width: ${(props) => (props.$usePortrait ? '33.333vw' : '42vw')};
	position: relative;

	@media ${(props) => props.theme.mediaBreakpoints.mobile} {
		width: ${(props) => (props.$usePortrait ? '60vw' : '75vw')};
	}

	.image-component-wrapper,
	.video-component-wrapper {
		padding-top: ${(props) => (props.$usePortrait ? '125%' : '80%')};
	}
`;

const FullProjectWrapper = styled.div`
	height: 100%;
	width: 100%;

	* {
		height: 100%;
		width: 100%;
	}
`;

const MobileProjectMedia = (props: Props) => {
	const {
		data,
		nextProjectGalleryBlocks,
		setActiveSlideIndex,
		activeSlideIndex,
		nextProjectSlug,
		type
	} = props;

	const hasData = data?.length > 0;
	const rootNodeRef = useRef<HTMLDivElement>(null);

	const slides = [...(data ?? []), ...(nextProjectGalleryBlocks ?? [])];

	const [emblaRef, emblaApi] = useEmblaCarousel(
		{
			loop: false,
			axis: 'y',
			align: 'start',
			containScroll: false
		},
		[WheelGesturesPlugin()]
	);

	const router = useRouter();

	useEffect(() => {
		if (!emblaApi) return;

		const lastSlideIndex = slides.length - 1;

		if (activeSlideIndex === lastSlideIndex) {
			const timer = setTimeout(() => {
				router.push(`/${type}/${nextProjectSlug}`);
			}, 200);

			return () => {
				clearTimeout(timer);
			};
		}
	}, [activeSlideIndex]);

	useEffect(() => {
		if (!emblaApi) return;
		emblaApi?.on('pointerUp', () => {
			const activeSlideIndex = emblaApi.selectedScrollSnap();
			setActiveSlideIndex && setActiveSlideIndex(activeSlideIndex);
		});
		emblaApi?.on('settle', () => {
			const activeSlideIndex = emblaApi.selectedScrollSnap();
			setActiveSlideIndex && setActiveSlideIndex(activeSlideIndex);
		});
	}, [emblaApi]);

	return (
		<MobileProjectMediaWrapper ref={rootNodeRef}>
			<Embla className="embla" ref={emblaRef}>
				<EmblaContainer className="embla__container">
					{hasData &&
						slides.map((item, i) => (
							<EmblaSlide key={i} className="embla__slide">
								{(item as FullBleedSlideType | CroppedSlideType)
									?.galleryComponent === 'croppedSlide' && (
									<CroppedProjectWrapper
										$usePortrait={
											item?.croppedSlide
												?.orientationType === 'portrait'
										}
									>
										{item?.croppedSlide.media && (
											<MediaStack
												data={item.croppedSlide.media}
												isPriority
												isFullScreen={false}
											/>
										)}
									</CroppedProjectWrapper>
								)}
								{(item as FullBleedSlideType | CroppedSlideType)
									?.galleryComponent === 'fullBleedSlide' && (
									<FullProjectWrapper>
										{item?.fullBleedSlide?.media && (
											<MediaStack
												data={
													item?.fullBleedSlide?.media
												}
												isPriority
											/>
										)}
									</FullProjectWrapper>
								)}
							</EmblaSlide>
						))}
				</EmblaContainer>
			</Embla>
		</MobileProjectMediaWrapper>
	);
};

export default MobileProjectMedia;

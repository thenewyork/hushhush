import styled from 'styled-components';
import {
	CaseStudyType,
	ClientType,
	CroppedSlideType,
	FullBleedSlideType,
	RepresentationType
} from '../../../shared/types/types';
import MediaStack from '../../common/MediaStack';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import randomIntFromInterval from '../../../utils/randomIntFromInterval';
import MobileProjectMedia from '../../blocks/MobileProjectMedia';
import DesktopProjectMedia from '../../blocks/DesktopProjectMedia';
import ProjectCursorLayout from '../../blocks/ProjectCursorLayout';

type Props = {
	activeSlideIndex: number;
	data: (
		| ClientType
		| RepresentationType
		| CaseStudyType
		| FullBleedSlideType
		| CroppedSlideType
	)[];
	type:
		| 'clients'
		| 'representations'
		| 'case-study'
		| 'representation-project'
		| 'case-study-project';
	setActiveSlideIndex?: (index: number) => void;
	nextProjectSlug?: string;
	prevProjectSlug?: string;
};

const MediaLayoutWrapper = styled(motion.section)`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100vh;
	z-index: 50;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const ClientMediaWrapper = styled.div`
	height: 100%;
	width: 100%;

	* {
		height: 100%;
		width: 100%;
	}
`;

const RepresentationMediaWrapper = styled.a`
	width: 33.333vw;
	position: relative;

	@media ${(props) => props.theme.mediaBreakpoints.mobile} {
		width: 50vw;
		top: -8%;
	}

	.image-component-wrapper,
	.video-component-wrapper {
		padding-top: 125%;
	}
`;

const CaseStudyMediaWrapper = styled.a`
	height: 100%;
	width: 100%;

	* {
		height: 100%;
		width: 100%;
	}
`;

const wrapperVariants = {
	hidden: {
		opacity: 0,
		transition: {
			duration: 0.3,
			ease: 'easeInOut'
		}
	},
	visible: {
		opacity: 1,
		transition: {
			duration: 0.3,
			ease: 'easeInOut'
		}
	}
};

const MediaLayout = (props: Props) => {
	const {
		activeSlideIndex,
		setActiveSlideIndex,
		data,
		type,
		nextProjectSlug,
		prevProjectSlug
	} = props;

	if (!data || data.length <= 0) return null;

	return (
		<AnimatePresence>
			{data && (
				<MediaLayoutWrapper
					className={`media-layout`}
					variants={wrapperVariants}
					initial="hidden"
					animate="visible"
					exit="hidden"
					key={randomIntFromInterval(0, 10000)}
				>
					{type === 'clients' && (
						<ClientMediaWrapper>
							{data[activeSlideIndex]?.media && (
								<MediaStack
									data={data[activeSlideIndex].media}
									isPriority
								/>
							)}
						</ClientMediaWrapper>
					)}
					{type === 'representations' && (
						<Link
							href={`/representation/${
								(data[activeSlideIndex] as RepresentationType)
									?.slug?.current
							}`}
							passHref
							legacyBehavior
						>
							<RepresentationMediaWrapper>
								{(data[activeSlideIndex] as RepresentationType)
									?.media && (
									<MediaStack
										data={
											(
												data[
													activeSlideIndex
												] as RepresentationType
											).media
										}
										isPriority
										isFullScreen={false}
									/>
								)}
							</RepresentationMediaWrapper>
						</Link>
					)}
					{type === 'case-study' && (
						<Link
							href={`/case-studies/${
								(data[activeSlideIndex] as CaseStudyType)?.slug
									?.current
							}`}
							passHref
							legacyBehavior
						>
							<CaseStudyMediaWrapper>
								{(data[activeSlideIndex] as CaseStudyType)
									?.media && (
									<MediaStack
										data={
											(
												data[
													activeSlideIndex
												] as RepresentationType
											).media
										}
										isPriority
									/>
								)}
							</CaseStudyMediaWrapper>
						</Link>
					)}
					{(type === 'representation-project' ||
						type === 'case-study-project') && (
						<>
							<DesktopProjectMedia
								data={data}
								activeSlideIndex={activeSlideIndex}
								wrapperVariants={wrapperVariants}
							/>
							<ProjectCursorLayout
								nextProjectSlug={nextProjectSlug}
								prevProjectSlug={prevProjectSlug}
								setActiveSlideIndex={setActiveSlideIndex}
								activeSlideIndex={activeSlideIndex}
								type={type}
								data={data}
							/>
						</>
					)}
				</MediaLayoutWrapper>
			)}
		</AnimatePresence>
	);
};

export default MediaLayout;

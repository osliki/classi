import React from 'react'
import ContentLoader from 'react-content-loader'

export const ImgLoader = (props) => (
  <ContentLoader height="150" {...props}>
    {/* Pure SVG */}
    <rect x="0" y="0" rx="3" ry="3" width="100%" height="160" />
  </ContentLoader>
)


export const ImgMiddleLoader = (props) => (
  <ContentLoader width="150" height="150" {...props}>
    {/* Pure SVG */}
    <rect x="0" y="0" rx="3" ry="3" width="100%" height="100%" />
  </ContentLoader>
)

export const SmallImgLoader = (props) => (
  <ContentLoader width="80" height="80" {...props}>
    {/* Pure SVG */}
    <rect x="0" y="0" rx="3" ry="3" width="100%" height="100%" />
  </ContentLoader>
)

export const HeaderLoader = (props) => (
  <ContentLoader height="35" {...props}>
    {/* Pure SVG */}
    <rect x="0" y="0" rx="3" ry="3" width="70%" height="25" />
  </ContentLoader>
)

export const TextLoader = (props) => (
  <ContentLoader height="50" {...props}>
    {/* Pure SVG */}
    <rect x="0" y="0" rx="3" ry="3" width="100%" height="12" />
    <rect x="0" y="20" rx="3" ry="3" width="60%" height="12" />
    <rect x="0" y="40" rx="3" ry="3" width="80%" height="12" />
  </ContentLoader>
)

export const InfoLoader = (props) => (
  <ContentLoader height="40" {...props}>
    {/* Pure SVG */}
    <rect x="0" y="0" rx="3" ry="3" width="60%" height="35" />
  </ContentLoader>
)

export const CardLoader = (props) => (
  <div>
    <InfoLoader {...props} />
    <ImgLoader {...props} />
    <HeaderLoader {...props} />
    <TextLoader {...props} />
  </div>

)

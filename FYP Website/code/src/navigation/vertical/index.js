// ** Icon imports

import CubeOutline from 'mdi-material-ui/CubeOutline'
import HomeOutline from 'mdi-material-ui/HomeOutline'

const navigation = () => {
  return [
    {
      sectionTitle: 'Insights'
    },
    {
      title: 'My Skills',
      icon: HomeOutline,
      path: '/insights/acquired-skills',
      openInNewTab: false
    },
    {
      title: 'Recommendations',
      icon: CubeOutline,
      path: '/insights/recommendations',
      openInNewTab: false
    },
  ]
}

export default navigation

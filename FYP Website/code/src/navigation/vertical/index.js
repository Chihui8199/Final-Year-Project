// ** Icon imports

import CubeOutline from 'mdi-material-ui/CubeOutline'
import HomeOutline from 'mdi-material-ui/HomeOutline'

const navigation = () => {
  return [
    {
      title: 'My Skills',
      icon: HomeOutline,
      path: '/pages/acquired-skills',
      openInNewTab: false
    },
    {
      title: 'Recommendations',
      icon: CubeOutline,
      path: '/pages/error', // TODO: route to recommendations
      openInNewTab: false
    },
  ]
}

export default navigation

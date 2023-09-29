// ** Icon imports

import CubeOutline from 'mdi-material-ui/CubeOutline'
import HomeOutline from 'mdi-material-ui/HomeOutline'

import { getRoutePath } from 'src/utils/routes/routeUtils'

const navigation = () => {
  return [
    {
      sectionTitle: 'Insights'
    },
    {
      title: 'My Skills',
      icon: HomeOutline,
      path: getRoutePath('Acquired Skills'),
      openInNewTab: false
    },
    {
      title: 'Recommendations',
      icon: CubeOutline,
      path: getRoutePath('Recommendations'),
      openInNewTab: false
    },
  ]
}

export default navigation

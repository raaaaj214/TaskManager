import {v2 as cloudinary} from 'cloudinary';

const config = () => {cloudinary.config({ 
    cloud_name: 'dydzkarpe', 
    api_key: '933782962728989', 
    api_secret: '1NMmer87EFNXteasMdLNk32iGj8' 
  })
}

export default config

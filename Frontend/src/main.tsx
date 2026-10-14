import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Layout } from './components/layout-area/layout/layout'
import './index.css'
import { interceptor } from './utils/interceptor'

// Create interceptor: 
interceptor.create();

createRoot(document.getElementById('root')!).render(

    <BrowserRouter>

        <Layout />

    </BrowserRouter>

)

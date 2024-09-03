import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import '../styles/error_page.css'
import AnimatedText_404 from '../components/custom/SVG404';

export default function ErrorPage() {

    let error = useRouteError();

    console.error(error)

    if(isRouteErrorResponse(error)) {
        
        
    }else {
        
    }

    return (
        <>
            <div className="error_page">
                <div className="img_container">
                    <AnimatedText_404/>
                </div>
                <div className="error_description">
                    <h2 className="error_title">
                        404: You've Taken a Wrong Turn!
                    </h2>
                    <p className="error_message">
                        
                        <b style={{marginBottom: 10+"px",}}>What Happened?</b><br />
                        Either this page does not exist<br />
                       Or you are not supposed to be here 😏<br />
                        
                        <b style={{marginBottom: 10+"px",}}>What Can You Do Now?</b><br />
                        
                        <a style={{textDecoration: 'none'}} href='/'>This way please</a><br />
                        Or use the back button to return to where you came from.
                        
                        Contact Us: Reach out to us if you need assistance, or just want to ask where this page disappeared to.
                    </p>
                </div>
            </div>
            
        </>
    )
}

import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import '../styles/error_page.css'
import AnimatedText from '../components/custom/SvgImg';
import { ENVIRONMENT } from '../constants/BaseConfig';

export default function ErrorPage() {

    let error = useRouteError();

    console.error(error)
    let errorMessage = '';

    if(ENVIRONMENT == "DEBUG") {
        if (isRouteErrorResponse(error)) {
            // error is type `ErrorResponse`
            errorMessage = error.error?.message || error.statusText;
        } else if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'string') {
            errorMessage = error;
        } else {
            console.error(error);
            errorMessage = 'Unknown error';
        }
    }

    return (
        <>
            <div className="error_page">
                <div className="img_container">
                    <AnimatedText/>
                </div>
                <div className="error_description">
                    <h3 className="error_title">
                        Something Went Wrong
                    </h3>
                    <p className="error_message">
                        Oh No! Something went wrong. <br/> Not You. Please be patient while we resolve this. You can going back to the home page
                    </p>
                    <p className='error_debug_message'>
                        {errorMessage != '' ? errorMessage: ""}
                    </p>
                </div>
            </div>
            
        </>
    )
}

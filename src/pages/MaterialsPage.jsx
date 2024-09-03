import { REST_API_BASE_URL } from "../constants/BaseConfig"

export default function MaterialsPage() {
    const client = ZoomMtgEmbedded.createClient()

    var authEndpoint = REST_API_BASE_URL+'/zoom/v1/meeting/start'
    var meetingNumber = '9027840028'
    var role =1
    var userName = ''
    var userEmail = ''

    function getSignature(e) {
        e.preventDefault();

        fetch(authEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'meeting': meetingNumber,
                'role': role
            })
        }).then(
            res => {
                return res.json()
        }).then(response => {
            startMeeting(response.signature, response.sdkKey, response.token, )
        }).catch(error => {
            console.error(error)
        })
    }

    function startMeeting(signature, sdkKey, zakToken) {

        let meetingSDKElement = document.getElementById('meetingSDKElement');

        client.init({ zoomAppRoot: meetingSDKElement, language: 'en-US', patchJsMedia: true, leaveOnPageUnload: true }).then(() => {
            client.join({
                signature: signature,
                sdkKey: sdkKey,
                meetingNumber: meetingNumber,
                password: '59hs5i',
                userName: 'Teacher',
                userEmail: userEmail,
                zak: zakToken
            }).then(() => {
                console.log('joined successfully')
            }).catch((error) => {
                console.log(error)
            })
        }).catch((error) => {
            console.log(error)
        })
    }

    return (
        <div className="App">
            <main>
                <h1>Zoom Meeting SDK Sample React</h1>

                {/* For Component View */}
                <div id="meetingSDKElement">
                    {/* Zoom Meeting SDK Component View Rendered Here */}
                </div>

                <button onClick={getSignature}>Join Meeting</button>
            </main>
        </div>
    );
}
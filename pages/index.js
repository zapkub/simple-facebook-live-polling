
import React from 'react';
import Head from 'next/head';

export default class IndexPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: null,
            isLogin: false,
            liveKey: '',
            reactions: {},
        }
        this.getSessionToken = this.getSessionToken.bind(this);
        this.getReactions = this.getReactions.bind(this);

    }
    componentDidMount() {
        if (typeof window !== 'undefined') {
            console.log('init');
            window.fbAsyncInit = function () {
                FB.init({
                    appId: '1824824607769616',
                    xfbml: true,
                    version: 'v2.8'
                });
                FB.AppEvents.logPageView();
            };

            (function (d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) { return; }
                js = d.createElement(s); js.id = id;
                js.src = "//connect.facebook.net/en_US/sdk.js";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        }
    }
    getSessionToken() {
        FB.login(() => {
            this.setState({ isLogin: true })
        }, { scope: 'email, manage_pages' })
    }
    getReactions() {
        // 1356008097792375
        FB.api(
            `/${this.state.liveKey}?fields=reactions,video_insights`,
            (response) => {
                console.log(response);
                if (response && !response.error) {
                    /* handle the result */
                    // console.log(response);
                    console.log(response);
                    const reactionsdata = response.video_insights.data.filter(item => item.name == 'total_video_reactions_by_type_total');

                    console.log(reactionsdata);
                    if (reactionsdata[0])
                        this.setState({
                            reactions: reactionsdata[0].values[0].value
                        })
                    // this.setState({
                    //     reactions: response.data
                    // })
                }
            }
        );
        
    }
    render() {
        if (!this.state.isLogin)
            return (
                <div>
                    <Head>
                    </Head>
                    {'hi'}
                    <button onClick={this.getSessionToken}> {'Login'} </button>
                </div>
            )
        else {
            return (
                <div> Logged in
                <input onChange={(e) => this.setState({ liveKey: e.target.value })} />
                    <button onClick={this.getReactions} > get reaction </button>
                    {console.log(this.state.reactions)}
                    {
                        Object.keys(this.state.reactions).map(
                            key => {
                               return <div key={key}> {key}: {this.state.reactions[key]} </div>
                            }
                        )
                    }
                </div>)
        }
    }
}
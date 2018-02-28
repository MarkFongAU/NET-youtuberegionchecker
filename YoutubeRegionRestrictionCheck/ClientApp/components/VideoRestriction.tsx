import * as React from 'react';
import {Link, RouteComponentProps} from 'react-router-dom';
import {connect} from 'react-redux';
import {ApplicationState} from '../store';
import * as VideoRestrictionState from '../store/VideoRestriction';

// At runtime, Redux will merge together...
type VideoRestrictionProps =
    VideoRestrictionState.VideoRestrictionState  // ... state we've requested from the Redux store
    & typeof VideoRestrictionState.actionCreators// ... plus action creators we've requested
    & RouteComponentProps<{ videoUrl: string }>; // ... plus incoming routing parameters

class VideoRestriction extends React.Component<VideoRestrictionProps, {}> {
    componentWillMount() {
        // This method runs when the component is first added to the page
        let videoUrl = this.props.match.params.videoUrl;
        this.props.requestVideoRestrictionStatus(videoUrl);
    }

    componentWillReceiveProps(nextProps: VideoRestrictionProps) {
        // This method runs when incoming props (e.g., route params) change
        let videoUrl = nextProps.match.params.videoUrl;
        this.props.requestVideoRestrictionStatus(videoUrl);
    }

    public render() {
        return <div>
            {/* Youtube Video World Map Restriction SVG*/}
            <h1>Youtube Video Restriction World Map</h1>
            <svg viewBox="0 0 100 100">
                <image xlinkHref={require('../image/worldHigh.svg')}>
                </image>
            </svg>
            
            <p>This component demonstrates fetching data from the server and Youtube API and working with URL
                parameters.</p>
            {this.renderVideoRestriction()}
            {this.renderInput()}
            
        </div>;
    }

    private renderInput() {
        let videoUrl1 = 'YRCdaIzMOVs';
        let videoUrl2 = 'Z9BHc8_I6UA';
        // return <form action={`/videorestriction/${videoUrl}`}>
        //     <div className="form-group">
        //         <label htmlFor='videoURL'>Video URL:</label>
        //         <input type='text' className='form-control' id='videoURL'/>
        //     </div>
        //     <button type="submit" className="btn btn-default">Submit</button>
        // </form>;

        return <p className='clearfix text-center'>
            <Link className='btn btn-default pull-left' to={ `/videorestriction/${ videoUrl1 }` }>Previous</Link>
            <Link className='btn btn-default pull-right' to={ `/videorestriction/${ videoUrl2 }` }>Next</Link>
            { this.props.isLoading ? <span>Loading...</span> : [] }
        </p>;
    }

    private renderVideoRestriction() {
        return <table className='table'>
            <thead>
            <tr>
                <th>Title</th>
                <th>Region Restricted</th>
            </tr>
            </thead>
            <tbody>
            {console.log(this.props.status)}
            {/*{this.props.status.map(status =>*/}
                {/*<tr key={status.id}>*/}
                    {/*<td>{status.title}</td>*/}
                    {/*<td>{status.regionRestriction.toString()}</td>*/}
                {/*</tr>*/}
            {/*)}*/}
            
                <tr key={this.props.status.id}>
                    <td>{this.props.status.title}</td>
                    <td>{this.props.status.regionRestriction.toString()}</td>
                </tr>
            
            </tbody>
        </table>;
    }
}

export default connect(
    (state: ApplicationState) => state.videoRestriction, // Selects which state properties are merged into the component's props
    VideoRestrictionState.actionCreators                 // Selects which action creators are merged into the component's props
)(VideoRestriction) as typeof VideoRestriction;
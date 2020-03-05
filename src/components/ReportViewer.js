import React, { Component } from 'react';
import PropTypes from 'prop-types';

// eslint-disable-next-line
import Loader from 'react-loader-spinner'


const propTypes = {
  showtoolbar: PropTypes.string,
  showparameters: PropTypes.string

};

const defaultProps = {
    title: 'ReportViewer',
    width: '100%',
    height: '550px',
    position: 'relative',
    frameBorder: 0
};



class ReportViewer extends Component {

  
    
  render() {


    var src = this.props.server + "/Pages/ReportViewer.aspx?" + this.props.path + "&rs:Embed=True&rc:Toolbar=" + this.props.showtoolbar + "&rc:Parameters=" + this.props.showparameters + "&" +this.props.parameters


    return (
        
      <div>
            <iframe 
                title={this.props.title}
                src={this.props.path ==='' ? '' : src}
                width={this.props.width}
                height={this.props.height}
                position={this.props.position}
                style={{frameBorder:this.props.frameBorder}}
                frameBorder={this.props.frameBorder}
                allowFullScreen
            />

      </div>
    );
  }
}

ReportViewer.propTypes = propTypes;
ReportViewer.defaultProps = defaultProps;

export default ReportViewer;
import React, { Component } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row
} from 'reactstrap';
import logo from '../../assets/img/brand/logo.png'
import withAuth from '../../components/withAuth';

//import { connect } from 'react-redux';
//import { addProfile, setCampaign, darkTheme,setAvatar } from '../../Redux/Actions/profile';

class Inicio extends Component {


  loading = () => <div className="animated fadeIn pt-1 text-center">Cargando...</div>


  render() {

    return (
      <div className="animated fadeIn">

        <Row>
          <Col>
            <Card>
              <CardHeader className="text-center">
                ¡Bienvenido! 
              </CardHeader>
              <CardBody className="text-center">
              <img src={logo}  alt="Logo CCS" className="img-fluid"/>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}


// const mapStateToProps = state => {
//   return {
//     profile: state.profile.profile,
//     campaign: state.campaign.campaign,
//     darkTheme: state.darkTheme.darkTheme
//   }
// }

// const mapDispatchToProps = dispatch => {
//   return {
//     addProfile: (name) => {
//       dispatch(addProfile(name))
//     },
//     setCampaign: (id) => {
//       dispatch(setCampaign(id))
//     },
//     darkTheme: (isDarkTheme) => {
//       dispatch(darkTheme(isDarkTheme))
//     },
//     setAvatar: (data) => {
//       dispatch(setAvatar(data))
//     }

//   }
// }


//export default connect(mapStateToProps, mapDispatchToProps)(withAuth(Inicio));
export default withAuth(Inicio)


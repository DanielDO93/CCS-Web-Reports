import 'react-tabulator/lib/styles.css'; 
import "react-tabulator/lib/css/bootstrap/tabulator_bootstrap.min.css"; 
import React, { Component } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row
} from 'reactstrap';

import withAuth from '../../components/withAuth';
import AuthService from '../../components/AuthService';
import { ReactTabulator } from 'react-tabulator'; // for React 15.x, use import { React15Tabulator }

const Auth = new AuthService();

const columns = [
      { title: "ID", field: "id", align: "center", headerFilter: true, headerFilterPlaceholder: "Buscar", width: 60 },
      { title: "Fecha", field: "Fecha_Apertura", align: "center", color: '#F0F3F5', headerFilter: true, headerFilterPlaceholder: "Buscar", width: 100 },
      { title: "Nombre", field: "nombre", align: "left", headerFilter: true, headerFilterPlaceholder: "Buscar", width: 150 },
      { title: "Telefono", field: "telefono_01", align: "center", headerFilter: true, headerFilterPlaceholder: "Buscar", width: 110 },
      { title: "Mail", field: "email", align: "left", headerFilter: true, headerFilterPlaceholder: "Buscar", width: 120 },
      { title: "Tienda", field: "Tienda", align: "left", headerFilter: true, headerFilterPlaceholder: "Buscar", width: 150 },
      { title: "Tipo Tienda", field: "tipo_tienda", align: "center", headerFilter: true, headerFilterPlaceholder: "Buscar", width: 100 },
      { title: "Motivo", field: "tip_n03", align: "center", headerFilter: true, headerFilterPlaceholder: "Buscar", width: 150 },
      { title: "Comentarios", field: "comentarios_queja", align: "center", headerFilter: true, headerFilterPlaceholder: "Buscar", width: 100 },
      { title: "Status", field: "estatus_queja", align: "center", headerFilter: true, headerFilterPlaceholder: "Buscar", width: 120 },
      { title: "Detalle Status", field: "detalle_estatus_queja", align: "center", headerFilter: true, headerFilterPlaceholder: "Buscar", width: 135 },
      { title: "Region", field: "region_tienda", align: "center", headerFilter: true, headerFilterPlaceholder: "Buscar", width: 130 },

];


const options = {

      movableRows: true,
      pagination: "local",
      paginationSize: 5

  
    };

class Inicio extends Component {


 state = {
    data: []
  };

  loading = () => <div className="animated fadeIn pt-1 text-center">Cargando...</div>




  componentDidMount(){


    Auth.fetch('/layout_Quejas')
        .then((response) => {
          return response;
        })
        .then((json) => {
          this.setState({data:json})
        });

  }

  render() {

    return (


      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardHeader className="text-center">
               <i className="icon-magnifier"></i>Busqueda de Quejas
              </CardHeader>
              <CardBody className="text-center">
                  <ReactTabulator index={"id"} data={this.state.data} columns={columns} tooltips={true} layout={"fitColumns"} options={options}/>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
  
}

export default withAuth(Inicio);

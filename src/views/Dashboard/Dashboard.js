import React, { Component } from "react";
import withAuth from "../../components/withAuth";
import DashboardVips from "../../views/Dashboard/Vips/DashboardVips";
import DashboardTelevia from "../../views/Dashboard/Televia/DashboardTelevia";
import DashboardGenerico from "../../views/Dashboard/Generico/DashboardGenerico";
import DashboardEdenred from "../../views/Dashboard/Edenred/DashboardEdenred";
import DashboardAltanRedes from "../../views/Dashboard/AltanRedes/AltanRedes";

class Dashboard extends Component {
  render() {
    switch (this.props.user.campania) {
      case 1:
        return <DashboardTelevia />;
      case 2:
        return <DashboardVips />;
      case 14:
        return <DashboardEdenred />;
      case 23:
        return <DashboardAltanRedes />;
      default:
        return <DashboardGenerico />;
    }
  }
}

export default withAuth(Dashboard);

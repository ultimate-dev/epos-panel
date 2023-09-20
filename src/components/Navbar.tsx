import { APP_NAME, OWNER_NAME } from "configs";
import RestaurantController from "controllers/restaurant.controller";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
// Store
import IStore from "store/instant.store";
import MStore from "store/main.store";
// Components
import LanguageDropdown from "./common/LanguageDropdown";
import ProfileMenu from "./common/ProfileMenu";
// Constant
import { UserRole } from "constants/statuses";

const Navbar = () => {
  const [createmenu, setCreateMenu] = useState(false);
  let [restaurantC] = useState(new RestaurantController());
  let navigate = useNavigate();

  useEffect(() => {
    restaurantC.get();
  }, []);

  useEffect(() => {
    if (restaurantC.restaurants.length > 0 && (MStore.restaurantId == null || !MStore.restaurantId))
      MStore.setRestaurantId(restaurantC.restaurants[0].id);
  }, [restaurantC.restaurants]);

  function toggle() {
    var body = document.body;
    body.classList.toggle("vertical-collpsed");
    body.classList.toggle("sidebar-enable");
  }

  return (
    <>
      <header id="page-topbar">
        <div className="navbar-header">
          <div className="d-flex">
            <div className="navbar-brand-box p-0">
              <Link
                to="/"
                className="logo logo-light d-flex align-items-center justify-content-center"
                style={{ height: 70 }}
              >
                <span className="logo-sm" style={{ lineHeight: 1.15 }}>
                  <img src={require("assets/images/logo-light.png")} alt="" height="32" />
                </span>
                <span className="logo-lg" style={{ lineHeight: 1.15 }}>
                  <img src={require("assets/images/logo-light.png")} alt="" height="32" />
                  <div className="d-inline-flex flex-column align-items-start justify-content-center ps-1">
                    <h4 className="text-white text-xl m-0 fw-bold">{APP_NAME}</h4>
                    <small className="text-white text-xl" style={{ opacity: 0.6 }}>
                      {OWNER_NAME}
                    </small>
                  </div>
                </span>
              </Link>
            </div>

            <button
              type="button"
              onClick={toggle}
              className="btn btn-sm px-3 font-size-24 header-item waves-effect vertical-menu-btn"
              id="vertical-menu-btn"
            >
              <i className="mdi mdi-menu"></i>
            </button>
            <div className="d-none d-sm-block">
              <Dropdown
                color="light"
                disabled={IStore.user?.role !== UserRole["SUPERADMIN"]}
                isOpen={createmenu}
                toggle={() => setCreateMenu(!createmenu)}
                className="d-inline-block"
              >
                <div className="dropdown dropdown-topbar pt-3 mt-1 d-inline-block">
                  <DropdownToggle className="btn btn-light" tag="button">
                    {restaurantC.restaurants.find((res) => res.id == MStore.restaurantId)?.name}
                    <i className="mdi mdi-chevron-down"></i>
                  </DropdownToggle>

                  <DropdownMenu className="dropdown-menu-end">
                    {restaurantC.restaurants.map((restaurant, index) => (
                      <DropdownItem
                        key={index}
                        tag="button"
                        onClick={() => {
                          MStore.setRestaurantId(restaurant.id);
                          window.location.reload();
                        }}
                      >
                        {restaurant.name}
                      </DropdownItem>
                    ))}

                    <div className="dropdown-divider"></div>
                    <DropdownItem onClick={() => navigate("/restaurants")}>Bayilerim</DropdownItem>
                  </DropdownMenu>
                </div>
              </Dropdown>
            </div>
          </div>
          <div className="d-flex">
            <LanguageDropdown />

            <div className="dropdown d-none d-lg-inline-block">
              <button
                type="button"
                onClick={() => {
                  document.fullscreenElement != null
                    ? IStore.fullScreen.exit()
                    : IStore.fullScreen.enter();
                }}
                className="btn header-item noti-icon waves-effect"
                data-toggle="fullscreen"
              >
                <i className="mdi mdi-fullscreen font-size-24"></i>
              </button>
            </div>
            <ProfileMenu />
          </div>
        </div>
      </header>
    </>
  );
};

export default observer(Navbar);

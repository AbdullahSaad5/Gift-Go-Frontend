import "./App.css";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";

import { MantineProvider } from "@mantine/core";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import CustomAppShell from "./components/layout/app-shell";
import Advertisements from "./pages/Advertisement";
import Claimed from "./pages/Claimed";
import Company from "./pages/Companies";
import Coupons from "./pages/Coupons";
import RewardRequests from "./pages/RewardRequests";
import Dashboard from "./pages/Dashboard";
import Drop from "./pages/Drop";
import ViewDrops from "./pages/Drop/ViewDrops";
import DropHistory from "./pages/DropHistory";
import DropRequests from "./pages/DropRequests";
import Live from "./pages/Live";
import OfferTypes from "./pages/Offers";
import Scheduled from "./pages/Scheduled";
import Settings from "./pages/Settings";
import Signin from "./pages/Siginin";
import SocialMediaLinks from "./pages/SocialMediaLinks";
import Tutorials from "./pages/Tutorials";
import Users from "./pages/Users";
import MoneyOwed from "./pages/MoneyOwed";
import Gift from "./pages/Gift";
import ViewGifts from "./pages/Gift/ViewGift";

function App() {
  return (
    <MantineProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/signin" element={<Signin />} />
          <Route path="/" element={<CustomAppShell />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add-drop" element={<Drop />} />
            <Route path="/add-gift" element={<Gift />} />
            <Route path="/gifts" element={<ViewGifts />} />
            <Route path="/drop" element={<ViewDrops />} />
            <Route path="/scheduled" element={<Scheduled />} />
            <Route path="/live" element={<Live />} />
            <Route path="/drop-history" element={<DropHistory />} />
            <Route path="/drop-requests" element={<DropRequests />} />
            <Route path="/claimed" element={<Claimed />} />
            <Route path="/reward-requests" element={<RewardRequests key="crypto" />} />
            <Route path="/users" element={<Users />} />
            <Route path="/owed" element={<MoneyOwed />} />
            <Route path="/companies" element={<Company />} />
            <Route path="/offers" element={<OfferTypes />} />
            <Route path="/coupons" element={<Coupons />} />
            <Route path="/tutorials" element={<Tutorials />} />
            <Route path="/advertisements" element={<Advertisements />} />
            <Route path="/social-media-links" element={<SocialMediaLinks />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to={"/"} />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;

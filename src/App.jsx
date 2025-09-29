import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import AffiliateDashboard from '@/components/AffiliateDashboard';
import MobileShare from './components/share/MobileShare';
import TabShare from './components/share/TabShare';


 function App() {
   const [deviceType, setDeviceType] = useState("big");

  useEffect(() => {
    const handleResize = () => {
      setDeviceType(window.innerWidth < 1024 ? "small" : "big");
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

 return (
    <>
          <Helmet>
        <title>Affiliate Dashboard - Manage Your Brands & UTM Parameters</title>
        <meta name="description" content="Professional affiliate dashboard to manage brand projects, save UTM parameters, and generate affiliate URLs automatically." />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900">
        <AffiliateDashboard />
 {deviceType === "small" ? <MobileShare /> : <TabShare />} 
      </div>
    </>

  );

}


 

export default App;

import React from 'react';
import { Helmet } from 'react-helmet';
import AffiliateDashboard from '@/components/AffiliateDashboard';


 function App() {
 return (
    <>
          <Helmet>
        <title>Affiliate Dashboard - Manage Your Brands & UTM Parameters</title>
        <meta name="description" content="Professional affiliate dashboard to manage brand projects, save UTM parameters, and generate affiliate URLs automatically." />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900">
        <AffiliateDashboard />

      </div>
    </>

  );

}


 

export default App;

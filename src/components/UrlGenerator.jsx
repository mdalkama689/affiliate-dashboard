import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Copy, ExternalLink, X, Link, Zap, RefreshCw, Plus, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import copy from 'copy-to-clipboard'



const UrlGenerator = ({ project, onClose, bitlyApiKey }) => {

  const ref = useRef()


  const [baseUrl, setBaseUrl] = useState('');
const [generatedUrl, setGeneratedUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [customParams, setCustomParams] = useState([]);
  const [isShortening, setIsShortening] = useState(false);


 

  const initializeParams = () => {

    const utms = {

      utm_source: project.utmSource || '',

      utm_medium: project.utmMedium || '',

      utm_campaign: project.utmCampaign || '',

      utm_term: project.utmTerm || '',

      utm_content: project.utmContent || '',

    };

    const projectCustoms = project.customParams || [];

    

    const allParams = [

      ...Object.entries(utms).map(([key, value]) => ({ key, value, isUtm: true })),

      ...projectCustoms.map(p => ({ ...p, isUtm: false }))

    ];

    setCustomParams(allParams);

  };


 

  useEffect(() => {
 initializeParams();
    setBaseUrl('');
    setGeneratedUrl('');
    setShortenedUrl('');

  }, [project]);


 

  const handleParamChange = (index, field, value) => {
 const newParams = [...customParams];
newParams[index][field] = value;
setCustomParams(newParams);
  };


  const shortenWithBitly = async (longUrl) => {

    if (!bitlyApiKey) {

      toast.error("❌ Bitly Error", {
        description: "Bitly API key is not configured in settings."
      })
   
      return null;
 }

    try {

      const response = await fetch('https://api-ssl.bitly.com/v4/shorten', {

        method: 'POST',

        headers: {

          'Authorization': `Bearer ${bitlyApiKey}`,

          'Content-Type': 'application/json'

        },

        body: JSON.stringify({ long_url: longUrl })

      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.description || 'Failed to shorten URL');

      return data.link;

    } catch (error) {

      toast.error("❌ Bitly Error", {
        description: error.message 
      })
      return null;

    }

  };


  const shortenWithCustomDomain = (longUrl) => {

    const hash = btoa(longUrl).substring(0, 6);

    toast.info("🚧 Custom Domain", {
      description: "This is a mock short URL. Integrate your own service for real shortening." });

    return `https://${project.customDomain}/${hash}`;

  };

  const generateUrl = async () => {

    if (!baseUrl.trim()) {

      toast.warning("⚠️ Missing URL", {
        description: "Please enter a base URL to generate the affiliate link." });
 return;
    }
 try {

      const url = new URL(baseUrl);

      const params = new URLSearchParams(url.search);

      customParams.forEach(param => {

        if (param.key && param.value) params.set(param.key, param.value);

      });

      url.search = params.toString();

      const longUrl = url.toString();

      setGeneratedUrl(longUrl);

      setShortenedUrl('');

      toast.success("🎉 URL Generated!", 
        {description: "Your affiliate URL is ready." });

      if (project.shortener && project.shortener !== 'none') {

        setIsShortening(true);

        let shortUrl = null;

        if (project.shortener === 'bitly') {

          shortUrl = await shortenWithBitly(longUrl);

        } else if (project.shortener === 'custom') {

          shortUrl = shortenWithCustomDomain(longUrl);

        }

        if (shortUrl) {

          setShortenedUrl(shortUrl);

          toast.success( "🔗 URL Shortened!", 
            {description: "Your short link is ready." });

        }

        setIsShortening(false);

      }

    } catch (error) {

      toast.error("❌ Invalid URL",
        { description: "Please enter a valid URL (including http:// or https://)" });

    }

  };


  const copyToClipboard = async (text) => { 
    try {
const isCopy  = copy(text)

if(isCopy){
      toast.success("📋 Copied!", 
        {description: "URL has been copied to your clipboard." });
}
} catch (error) {
 toast.error("❌ Copy Failed", {description: "Unable to copy to clipboard." }); 
    }
  };


 

  const openUrl = (url) => window.open(url, '_blank');

  const handleReset = () => {

    initializeParams();

    toast.info( "🔄 Reset!", 
      {description: "Parameters have been reset to project defaults." });

  };

  const addParam = () => setCustomParams([...customParams, { key: '', value: '', isUtm: false }]);

  const removeParam = (index) => setCustomParams(customParams.filter((_, i) => i !== index));



  return (

    <motion.div

      initial={{ opacity: 0, y: 20 }}

      animate={{ opacity: 1, y: 0 }}

      className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 mb-8"

    >

      <div className="flex justify-between items-center mb-6">

        <div>

          <h2 className="text-2xl font-bold text-white flex items-center gap-3">

            <Zap className="w-7 h-7 text-yellow-400" />

            URL Generator - {project.name}

          </h2>

          <p className="text-gray-400 mt-1">Generate affiliate URLs with custom tracking parameters</p>

        </div>

        <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full p-2">

          <X className="w-5 h-5" />

        </Button>

      </div>


 

      <div className="bg-white/5 rounded-2xl p-6 mb-6 border border-white/10">

        <div className="flex justify-between items-center mb-4">

            <h3 className="text-lg font-semibold text-white flex items-center gap-2">

              <Link className="w-5 h-5 text-purple-400" />

              Customizable Parameters

            </h3>

            <Button variant="outline" size="sm" onClick={handleReset} className="border-white/20 text-white hover:bg-white/10">

              <RefreshCw className="w-4 h-4 mr-2" />

              Reset to Defaults

            </Button>

        </div>

        <div className="space-y-3">

          {customParams.map((param, index) => (

            <div key={index} className="flex items-center gap-2">

              <Input value={param.key} onChange={(e) => handleParamChange(index, 'key', e.target.value)} placeholder="Parameter Name" className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400" disabled={param.isUtm} />

              <Input value={param.value} onChange={(e) => handleParamChange(index, 'value', e.target.value)} placeholder="Parameter Value" className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400" />

              <Button type="button" variant="ghost" size="sm" onClick={() => removeParam(index)} className="text-gray-400 hover:text-red-400 hover:bg-red-500/10 p-2" disabled={param.isUtm}>

                <Trash2 className="w-4 h-4" />

              </Button>

            </div>

          ))}

        </div>

        <Button type="button" variant="outline" onClick={addParam} className="border-white/20 text-white hover:bg-white/10 mt-4">

          <Plus className="w-4 h-4 mr-2" />

          Add Parameter for this URL

        </Button>

      </div>


 

      <div className="space-y-4">

        <div>

          <Label htmlFor="baseUrl" className="text-white mb-2 block">Base URL</Label>

          <div className="flex gap-3">

            <Input id="baseUrl" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} placeholder="https://example.com/product-page" className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400" />

            <Button onClick={generateUrl} className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-6">Generate</Button>

          </div>

        </div>


 

        {generatedUrl && (

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">

            <Label className="text-white block">Generated Affiliate URL</Label>

            <div className="bg-white/5 rounded-xl p-4 border border-white/10">

              <div className="flex items-center gap-3 mb-3">

                <div className="flex-1 bg-white/10 rounded-lg p-3 border border-white/20">

                  <p className="text-white text-sm break-all" >{generatedUrl}</p>

                </div>

              </div>

              <div className="flex gap-2">

                <Button onClick={() => copyToClipboard(generatedUrl)} variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">

                  <Copy className="w-4 h-4 mr-2" />

                  Copy URL

                </Button>

                <Button onClick={() => openUrl(generatedUrl)} variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">

                  <ExternalLink className="w-4 h-4 mr-2" />

                  Test URL

                </Button>

              </div>

            </div>

          </motion.div>

        )}


 

        {isShortening && (

          <div className="flex items-center justify-center text-white gap-2 p-4">

            <Loader2 className="w-5 h-5 animate-spin" />

            <span>Shortening link...</span>

          </div>

        )}


 

        {shortenedUrl && (

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">

            <Label className="text-white block">Shortened URL</Label>

            <div className="bg-white/5 rounded-xl p-4 border border-green-500/30">

              <div className="flex items-center gap-3 mb-3">

                <div className="flex-1 bg-white/10 rounded-lg p-3 border border-white/20">

                  <p className="text-white text-sm break-all font-bold">{shortenedUrl}</p>

                </div>

              </div>

              <div className="flex gap-2">

                <Button onClick={() => copyToClipboard(shortenedUrl)} variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">

                  <Copy className="w-4 h-4 mr-2" />

                  Copy Short URL

                </Button>

                <Button onClick={() => openUrl(shortenedUrl)} variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">

                  <ExternalLink className="w-4 h-4 mr-2" />

                  Test Short URL

                </Button>

              </div>

            </div>

          </motion.div>

        )}

      </div>

    </motion.div>

  );

};


 

export default UrlGenerator;

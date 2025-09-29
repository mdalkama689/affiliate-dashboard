import React, { useState, useEffect } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

import { X, Save, Sparkles, Plus, Trash2, Link as LinkIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';

import { Label } from '@/components/ui/label';

import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';



 

const ProjectModal = ({ isOpen, onClose, onSubmit, project }) => {

  const getInitialFormData = () => ({

    name: '',

    description: '',

    utmSource: '',

    utmMedium: '',

    utmCampaign: '',

    utmTerm: '',

    utmContent: '',

    customParams: [],

    shortener: 'none',

    customDomain: ''

  });


 

  const [formData, setFormData] = useState(getInitialFormData());


 

  useEffect(() => {

    if (isOpen) {

      if (project) {

        setFormData({ ...getInitialFormData(), ...project, customParams: project.customParams || [] });

      } else {

        setFormData(getInitialFormData());

      }

    }

  }, [project, isOpen]);


 

  const handleSubmit = (e) => {

    e.preventDefault();

    if (!formData.name.trim()) return;

    if (formData.shortener === 'custom' && !formData.customDomain.trim()) {

        toast.warning("⚠️ Missing Domain", {
            description: "Please enter a custom domain for the shortener."
        })

    
      return;

    }

    const finalData = { ...formData, customParams: formData.customParams.filter(p => p.key.trim() !== '') };

    onSubmit(finalData);

    onClose();

  };


 

  const handleChange = (field, value) => {

    setFormData(prev => ({ ...prev, [field]: value }));

  };


 

  const handleCustomParamChange = (index, field, value) => {

    const newCustomParams = [...formData.customParams];

    newCustomParams[index][field] = value;

    setFormData(prev => ({ ...prev, customParams: newCustomParams }));

  };


 

  const addCustomParam = () => {

    setFormData(prev => ({ ...prev, customParams: [...prev.customParams, { key: '', value: '' }] }));

  };


 

  const removeCustomParam = (index) => {

    const newCustomParams = formData.customParams.filter((_, i) => i !== index);

    setFormData(prev => ({ ...prev, customParams: newCustomParams }));

  };


 

  return (

    <AnimatePresence>

      {isOpen && (

        <motion.div

          initial={{ opacity: 0 }}

          animate={{ opacity: 1 }}

          exit={{ opacity: 0 }}

          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"

          onClick={onClose}

        >

          <motion.div

            initial={{ scale: 0.9, opacity: 0 }}

            animate={{ scale: 1, opacity: 1 }}

            exit={{ scale: 0.9, opacity: 0 }}

            className="bg-slate-800/90 backdrop-blur-xl rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20"

            onClick={e => e.stopPropagation()}

          >

            <div className="flex justify-between items-center mb-8">

              <div>

                <h2 className="text-3xl font-bold text-white flex items-center gap-3">

                  <Sparkles className="w-8 h-8 text-purple-400" />

                  {project ? 'Edit Project' : 'New Project'}

                </h2>

                <p className="text-gray-400 mt-2">Configure your brand and tracking parameters</p>

              </div>

              <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full p-2">

                <X className="w-6 h-6" />

              </Button>

            </div>


 

            <form onSubmit={handleSubmit} className="space-y-6">

              <div className="space-y-4">

                <h3 className="text-xl font-semibold text-white border-b border-white/20 pb-2">Project Details</h3>

                <div>

                  <Label htmlFor="name" className="text-white mb-2 block">Project Name *</Label>

                  <Input id="name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="e.g., Flipkart Affiliates" className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400" required />

                </div>

                <div>

                  <Label htmlFor="description" className="text-white mb-2 block">Description</Label>

                  <Textarea id="description" value={formData.description} onChange={(e) => handleChange('description', e.target.value)} placeholder="Brief description of this affiliate project..." className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 min-h-[80px]" />

                </div>

              </div>


 

              <div className="space-y-4">

                <h3 className="text-xl font-semibold text-white border-b border-white/20 pb-2">Default UTM Parameters</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div>

                    <Label htmlFor="utmSource" className="text-white mb-2 block">UTM Source *</Label>

                    <Input id="utmSource" value={formData.utmSource} onChange={(e) => handleChange('utmSource', e.target.value)} placeholder="e.g., website" className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400" required />

                  </div>

                  <div>

                    <Label htmlFor="utmMedium" className="text-white mb-2 block">UTM Medium *</Label>

                    <Input id="utmMedium" value={formData.utmMedium} onChange={(e) => handleChange('utmMedium', e.target.value)} placeholder="e.g., affiliate" className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400" required />

                  </div>

                  <div>

                    <Label htmlFor="utmCampaign" className="text-white mb-2 block">UTM Campaign *</Label>

                    <Input id="utmCampaign" value={formData.utmCampaign} onChange={(e) => handleChange('utmCampaign', e.target.value)} placeholder="e.g., summer_sale" className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400" required />

                  </div>

                  <div>

                    <Label htmlFor="utmTerm" className="text-white mb-2 block">UTM Term</Label>

                    <Input id="utmTerm" value={formData.utmTerm} onChange={(e) => handleChange('utmTerm', e.target.value)} placeholder="e.g., running_shoes" className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400" />

                  </div>

                  <div className="md:col-span-2">

                    <Label htmlFor="utmContent" className="text-white mb-2 block">UTM Content</Label>

                    <Input id="utmContent" value={formData.utmContent} onChange={(e) => handleChange('utmContent', e.target.value)} placeholder="e.g., banner_ad" className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400" />

                  </div>

                </div>

              </div>


 

              <div className="space-y-4">

                <h3 className="text-xl font-semibold text-white border-b border-white/20 pb-2">Custom Parameters</h3>

                <div className="space-y-3">

                  {formData.customParams.map((param, index) => (

                    <div key={index} className="flex items-center gap-2">

                      <Input value={param.key} onChange={(e) => handleCustomParamChange(index, 'key', e.target.value)} placeholder="Parameter Name (e.g., affid)" className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400" />

                      <Input value={param.value} onChange={(e) => handleCustomParamChange(index, 'value', e.target.value)} placeholder="Parameter Value" className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400" />

                      <Button type="button" variant="ghost" size="sm" onClick={() => removeCustomParam(index)} className="text-gray-400 hover:text-red-400 hover:bg-red-500/10 p-2">

                        <Trash2 className="w-4 h-4" />

                      </Button>

                    </div>

                  ))}

                </div>

                <Button type="button" variant="outline" onClick={addCustomParam} className="border-white/20 text-white hover:bg-white/10">

                  <Plus className="w-4 h-4 mr-2" />

                  Add Custom Parameter

                </Button>

              </div>


 

              <div className="space-y-4">

                <h3 className="text-xl font-semibold text-white border-b border-white/20 pb-2 flex items-center gap-2"><LinkIcon className="w-5 h-5" /> URL Shortener</h3>

                <div className="flex gap-4">

                 <Button
  type="button"
  onClick={() => handleChange('shortener', 'none')}
  variant={formData.shortener === 'none' ? 'secondary' : 'outline'}
  className={`flex-1 text-white px-4 py-2 rounded-lg transition-all duration-200 
    ${formData.shortener === 'none' 
      ? 'border border-white bg-gray-800 shadow-md' 
      : 'border border-gray-600 hover:bg-gray-700'}`}
>
  None
</Button>

<Button
  type="button"
  onClick={() => handleChange('shortener', 'bitly')}
  variant={formData.shortener === 'bitly' ? 'secondary' : 'outline'}
  className={`flex-1 text-white px-4 py-2 rounded-lg transition-all duration-200 
    ${formData.shortener === 'bitly' 
      ? 'border border-white bg-gray-800 shadow-md' 
      : 'border border-gray-600 hover:bg-gray-700'}`}
>
  Bitly
</Button>

<Button
  type="button"
  onClick={() => handleChange('shortener', 'custom')}
  variant={formData.shortener === 'custom' ? 'secondary' : 'outline'}
  className={`flex-1 text-white px-4 py-2 rounded-lg transition-all duration-200 
    ${formData.shortener === 'custom' 
      ? 'border border-white bg-gray-800 shadow-md' 
      : 'border border-gray-600 hover:bg-gray-700'}`}
>
  Custom Domain
</Button>

                </div>

                {formData.shortener === 'custom' && (

                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pt-4">

                    <Label htmlFor="customDomain" className="text-white mb-2 block">Custom Short Domain *</Label>

                    <Input id="customDomain" value={formData.customDomain} onChange={(e) => handleChange('customDomain', e.target.value)} placeholder="e.g., my.link" className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400" />

                  </motion.div>

                )}

              </div>


 

              <div className="flex gap-4 pt-6">

                <Button type="button" variant="outline" onClick={onClose} className="flex-1 border-white/20 text-white hover:bg-white/10">Cancel</Button>

                <Button type="submit" className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">

                  <Save className="w-4 h-4 mr-2" />

                  {project ? 'Update Project' : 'Create Project'}

                </Button>

              </div>

            </form>

          </motion.div>

        </motion.div>

      )}

    </AnimatePresence>

  );

};


 

export default ProjectModal;

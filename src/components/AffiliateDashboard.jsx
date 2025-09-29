import React, { useState, useEffect } from 'react';

import { motion } from 'framer-motion';

import { Plus, ExternalLink, Trash2, Edit3, Tag, Settings, X } from 'lucide-react';

import { Button } from '@/components/ui/button';


import ProjectModal from '@/components/ProjectModal';

import UrlGenerator from '@/components/UrlGenerator';

import QuickUrlGenerator from '@/components/QuickUrlGenerator';

import { Input } from '@/components/ui/input';

import { Label } from '@/components/ui/label';
import { toast } from 'sonner';


 

const AffiliateDashboard = () => {

  const [projects, setProjects] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingProject, setEditingProject] = useState(null);

  const [selectedProject, setSelectedProject] = useState(null);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [bitlyApiKey, setBitlyApiKey] = useState('');


 

  useEffect(() => {

    const savedProjects = localStorage.getItem('affiliateProjects');

    if (savedProjects) {

      setProjects(JSON.parse(savedProjects));

    }

    const savedBitlyKey = localStorage.getItem('bitlyApiKey');

    if (savedBitlyKey) {

      setBitlyApiKey(savedBitlyKey);

    }

  }, []);


 

  const saveProjects = (updatedProjects) => {

    localStorage.setItem('affiliateProjects', JSON.stringify(updatedProjects));

    setProjects(updatedProjects);

  };


 

  const handleSaveSettings = () => {

    localStorage.setItem('bitlyApiKey', bitlyApiKey);

    setIsSettingsOpen(false);

    toast.success("⚙️ Settings Saved", {
        description: "Your Bitly API key has been updated."
    })
    };


 

  const handleCreateProject = (projectData) => {

    const newProject = {

      id: Date.now().toString(),

      ...projectData,

      createdAt: new Date().toISOString()

    };

    const updatedProjects = [...projects, newProject];

    saveProjects(updatedProjects);

    toast.success("🎉 Project Created!", {
        description: `${projectData.name} has been added to your dashboard.`
    })
 

  };


 

  const handleUpdateProject = (projectData) => {

    const updatedProjects = projects.map(p => 

      p.id === editingProject.id ? { ...p, ...projectData } : p

    );

    saveProjects(updatedProjects);

    if (selectedProject && selectedProject.id === editingProject.id) {

      setSelectedProject(updatedProjects.find(p => p.id === editingProject.id));

    }

    toast.error("✨ Project Updated!", {
        description: `${projectData.name} has been successfully updated.`
    })};


 

  const handleDeleteProject = (projectId) => {

    if (selectedProject && selectedProject.id === projectId) {

      setSelectedProject(null);

    }

    const updatedProjects = projects.filter(p => p.id !== projectId);

    saveProjects(updatedProjects);

    toast.info("🗑️ Project Deleted", {
        description: "Project has been removed from your dashboard."
    })
  

  };


 

  const openModal = (project = null) => {

    setEditingProject(project);

    setIsModalOpen(true);

  };


 

  const closeModal = () => {

    setIsModalOpen(false);

    setEditingProject(null);

  };


 

  return (

    <div className="min-h-screen p-6">

      <div className="max-w-7xl mx-auto">

        <motion.div

          initial={{ opacity: 0, y: -20 }}

          animate={{ opacity: 1, y: 0 }}

          className="text-center mb-12"

        >

          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">

            Affiliate Dashboard

          </h1>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto">

            Manage your brand projects and generate affiliate URLs with custom UTM parameters

          </p>

        </motion.div>


 

        {projects.length > 0 && (

          <QuickUrlGenerator projects={projects} bitlyApiKey={bitlyApiKey} />

        )}


 

        <motion.div

          initial={{ opacity: 0, y: 20 }}

          animate={{ opacity: 1, y: 0 }}

          transition={{ delay: 0.2 }}

          className="flex justify-between items-center mb-8"

        >

          <div className="text-white flex items-center gap-4">

            <div className='flex items-center'>

              <span className="text-2xl font-semibold">{projects.length}</span>

              <span className="text-gray-400 ml-2">Active Projects</span>

            </div>

            <Button variant="ghost" size="sm" onClick={() => setIsSettingsOpen(true)} className="text-gray-400 hover:text-white hover:bg-white/10">

              <Settings className="w-5 h-5 mr-2" />

              Settings

            </Button>

          </div>

          <Button

            onClick={() => openModal()}

            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"

          >

            <Plus className="w-5 h-5 mr-2" />

            New Project

          </Button>

        </motion.div>


 

        {isSettingsOpen && (

          <motion.div

            initial={{ opacity: 0, y: 20 }}

            animate={{ opacity: 1, y: 0 }}

            className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 mb-8"

          >

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-2xl font-bold text-white flex items-center gap-3">

                <Settings className="w-7 h-7 text-purple-400" />

                Global Settings

              </h2>

              <Button variant="ghost" size="sm" onClick={() => setIsSettingsOpen(false)} className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full p-2">

                <X className="w-5 h-5" />

              </Button>

            </div>

            <div className="space-y-4">

              <div>

                <Label htmlFor="bitlyApiKey" className="text-white mb-2 block">Bitly API Key</Label>

                <Input id="bitlyApiKey" value={bitlyApiKey} onChange={(e) => setBitlyApiKey(e.target.value)} placeholder="Enter your Bitly Access Token" className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400" />

              </div>

              <Button onClick={handleSaveSettings} className="bg-gradient-to-r from-green-600 to-blue-600">Save Settings</Button>

            </div>

          </motion.div>

        )}


 

        {projects.length === 0 ? (

          <motion.div

            initial={{ opacity: 0 }}

            animate={{ opacity: 1 }}

            transition={{ delay: 0.4 }}

            className="text-center py-20"

          >

            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto border border-white/10">

              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">

                <Plus className="w-10 h-10 text-white" />

              </div>

              <h3 className="text-2xl font-semibold text-white mb-4">No Projects Yet</h3>

              <p className="text-gray-400 mb-6">Create your first brand project to start generating affiliate URLs</p>

              <Button

                onClick={() => openModal()}

                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"

              >

                Create First Project

              </Button>

            </div>

          </motion.div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">

            {projects.map((project, index) => (

              <motion.div

                key={project.id}

                initial={{ opacity: 0, y: 20 }}

                animate={{ opacity: 1, y: 0 }}

                transition={{ delay: index * 0.1 }}

                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-purple-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 flex flex-col"

              >

                <div className="flex-grow">

                  <div className="flex justify-between items-start mb-4">

                    <div>

                      <h3 className="text-xl font-semibold text-white mb-2">{project.name}</h3>

                      <p className="text-gray-400 text-sm">{project.description}</p>

                    </div>

                    <div className="flex gap-2">

                      <Button

                        variant="ghost"

                        size="sm"

                        onClick={() => openModal(project)}

                        className="text-gray-400 hover:text-white hover:bg-white/10"

                      >

                        <Edit3 className="w-4 h-4" />

                      </Button>

                      <Button

                        variant="ghost"

                        size="sm"

                        onClick={() => handleDeleteProject(project.id)}

                        className="text-gray-400 hover:text-red-400 hover:bg-red-500/10"

                      >

                        <Trash2 className="w-4 h-4" />

                      </Button>

                    </div>

                  </div>


 

                  <div className="space-y-3 mb-6">

                    <h4 className="text-sm font-semibold text-purple-300 flex items-center gap-2"><Tag className="w-4 h-4" /> Tracking Parameters</h4>

                    <div className="flex justify-between text-sm">

                      <span className="text-gray-400">utm_source:</span>

                      <span className="text-white font-mono">{project.utmSource}</span>

                    </div>

                    <div className="flex justify-between text-sm">

                      <span className="text-gray-400">utm_medium:</span>

                      <span className="text-white font-mono">{project.utmMedium}</span>

                    </div>

                    <div className="flex justify-between text-sm">

                      <span className="text-gray-400">utm_campaign:</span>

                      <span className="text-white font-mono">{project.utmCampaign}</span>

                    </div>

                    {project.customParams && project.customParams.map((param, i) => (

                      param.key && <div key={i} className="flex justify-between text-sm">

                        <span className="text-gray-400">{param.key}:</span>

                        <span className="text-white font-mono">{param.value}</span>

                      </div>

                    ))}

                  </div>

                </div>


 

                <Button

                  onClick={() => setSelectedProject(project)}

                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl mt-auto"

                >

                  <ExternalLink className="w-4 h-4 mr-2" />

                  Generate URLs

                </Button>

              </motion.div>

            ))}

          </div>

        )}


 

        {selectedProject && (

          <UrlGenerator

            project={selectedProject}

            onClose={() => setSelectedProject(null)}

            bitlyApiKey={bitlyApiKey}

          />

        )}


 

        <ProjectModal

          isOpen={isModalOpen}

          onClose={closeModal}

          onSubmit={editingProject ? handleUpdateProject : handleCreateProject}

          project={editingProject}

        />

      </div>

    </div>

  );

};


 

export default AffiliateDashboard;

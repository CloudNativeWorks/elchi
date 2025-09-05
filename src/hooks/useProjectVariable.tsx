import { DecodeToken } from '@/utils/tools';
import Cookies from 'js-cookie';
import React, { createContext, useState, useContext, ReactNode, useEffect, useMemo, useCallback } from 'react';


interface ProjectVariableContextType {
  project: string;
  //eslint-disable-next-line
  setProject: (value: string) => void;
}

const ProjectVariableContext = createContext<ProjectVariableContextType | undefined>(undefined);

interface ProjectVariableProviderProps {
  children: ReactNode;
}

export const ProjectVariableProvider: React.FC<ProjectVariableProviderProps> = ({ children }) => {
  const [project, setProjectState] = useState<string>(() => {
    const domainKey = window.location.hostname;
    const savedProject = localStorage.getItem(`selectedProject-${domainKey}`);
    return savedProject || '';
  });

  const setProject = useCallback((value: string) => {
    setProjectState(value);
  }, []);

  useEffect(() => {
    const checkTokenAndSetProject = () => {
      const token = Cookies.get('bb_token');
      if (token) {
        const userDetail = DecodeToken(token);
        if (userDetail?.base_project && !project) {
          setProjectState(userDetail.base_project);
        }
      }
    };

    checkTokenAndSetProject();
    
    // Removed interval - only check once on mount to avoid unnecessary re-renders
  }, [project]);

  useEffect(() => {
    const domainKey = window.location.hostname;
    localStorage.setItem(`selectedProject-${domainKey}`, project);
  }, [project]);

  const value = useMemo(() => ({ project, setProject }), [project, setProject]);

  return (
    <ProjectVariableContext.Provider value={value}>
      {children}
    </ProjectVariableContext.Provider>
  );
};

export const useProjectVariable = (): ProjectVariableContextType => {
  const context = useContext(ProjectVariableContext);

  if (!context) {
    throw new Error('useProjectVariable must be used within a ProjectVariableProvider');
  }

  return context;
};
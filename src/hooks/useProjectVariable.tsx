import { DecodeToken } from '@/utils/tools';
import Cookies from 'js-cookie';
import React, { createContext, useState, useContext, ReactNode, useEffect, useMemo } from 'react';


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
  const [project, setProject] = useState<string>(() => {
    const savedProject = localStorage.getItem('selectedProject');
    return savedProject || '';
  });

  useEffect(() => {
    const checkTokenAndSetProject = () => {
      const token = Cookies.get('bb_token');
      if (token) {
        const userDetail = DecodeToken(token);
        if (userDetail?.base_project && !project) {
          setProject(userDetail.base_project);
        }
      }
    };

    checkTokenAndSetProject();

    // Eğer çerez daha sonra ayarlanırsa diye izlemeye devam edebiliriz
    const intervalId = setInterval(() => {
      checkTokenAndSetProject();
    }, 1000);

    return () => clearInterval(intervalId); // Bellek sızıntısını önlemek için interval temizlenir
  }, [project]);

  useEffect(() => {
    localStorage.setItem('selectedProject', project);
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
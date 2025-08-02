import { NavLink, useParams } from 'react-router-dom';
import { getFieldsByKey } from '@/common/statics/gtypes';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import CustomDataTable from '@/elchi/components/common/dataTable';
import CustomListenerDataTable from '@/elchi/components/common/listenerDataTable';
import ElchiButton from '@/elchi/components/common/ElchiButton';
import { useState } from 'react';
import { Input } from 'antd';


const Resources: React.FC = () => {
    const { resource } = useParams();
    const resourceStatic = getFieldsByKey(resource)
    const { project } = useProjectVariable();
    const [searchText, setSearchText] = useState('');

    return (
        <>
            <div style={{
                background: '#fff',
                padding: '12px 12px 24px 12px',
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(5,117,230,0.06)',
                margin: '4px 0'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, justifyContent: 'space-between' }}>
                    <div>
                        {resource !== 'bootstrap' &&
                            <NavLink style={{ display: 'inline-block' }} to={resourceStatic.createPath}>
                                <ElchiButton>Add New</ElchiButton>
                            </NavLink>
                        }
                    </div>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Input.Search
                            placeholder="Search Resources..."
                            allowClear
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                            style={{ width: 220 }}
                        />
                    </span>
                </div>
                {resource !== 'listener' ?
                    <CustomDataTable path={`${resourceStatic.backendPath}?project=${project}`} searchText={searchText} /> :
                    <CustomListenerDataTable path={`${resourceStatic.backendPath}?project=${project}`} searchText={searchText} />
                }
            </div>
        </>
    );
}

export default Resources;

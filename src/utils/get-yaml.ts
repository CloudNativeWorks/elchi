import { saveAs } from 'file-saver';
import yaml from 'js-yaml';

export const GetYaml = (jsonData: any) => {
    const yamlStr = yaml.dump(jsonData, {
        styles: {
            '!!null': 'canonical'
        },
        lineWidth: 120,
        noRefs: true,
        noCompatMode: true,
    });

    const blob = new Blob([yamlStr], { type: 'text/yaml;charset=utf-8' });
    saveAs(blob, 'bootstrap.yaml');
};
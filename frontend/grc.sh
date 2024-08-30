#* GENERATE A COMPONENT

#*--- USAGE
#* bash grc.sh {directory} {yourcomponent}

#* $1 = directory - should be lowercase, will be converted to uppercase first where needed
#* $2 = component - should be capital/camelcase inline with react component 


# create component folder/file structure in src/components

mkdir src/components/$1/$2 # make new directory in components
touch src/components/$1/$2/$2.tsx # make component.tsx
touch src/components/$1/$2/index.ts # make index.ts



# ----- component.tsx ------ create starter functional component

echo "import React from 'react';

type Props = {};

const ${2}: React.FC<Props> = (props) => {
  return <div className='${2}'>${2}</div>;
};

export default ${2}; " >  src/components/$1/$2/$2.tsx



# ------ index.ts ------- create default export 

echo "import ${2} from './${2}';

export { ${2} }" >  src/components/$1/$2/index.ts



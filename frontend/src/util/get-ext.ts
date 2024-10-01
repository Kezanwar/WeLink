import { Extension } from '@app/components/FileIcon/FileIcon';

const getExt = (name: string) => {
  const textArr = name.split('.');
  const ext = textArr[textArr.length - 1].toLowerCase() as Extension;
  return ext;
};

export default getExt;

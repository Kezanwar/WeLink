import {
  BsFiletypeMov,
  BsFiletypeMp4,
  BsFiletypeGif,
  BsFiletypeCss,
  BsFiletypePdf,
  BsFiletypeDoc,
  BsFiletypeDocx,
  BsFiletypeXls,
  BsFiletypeXlsx,
  BsFiletypePpt,
  BsFiletypePptx,
  BsFiletypeTxt,
  BsFiletypeJpg,
  BsFiletypePng,
  BsFiletypeSvg,
  BsFiletypeMp3,
  BsFiletypeWav,
  BsFileEarmarkZip,
  BsFiletypeHtml,
  BsFiletypeJs,
  BsFiletypeJson,
  BsFiletypeJsx,
  BsFiletypeTsx,
  BsFiletypeXml,
  BsFileBinary,
  BsFileEarmarkText,
  BsFileEarmarkEasel,
  BsFiletypePhp,
  BsFiletypePsd,
  BsFiletypeExe,
  BsFiletypeAi,
  BsFileEarmarkBinary,
  BsFiletypeSass,
  BsFiletypeSh,
  BsFiletypeOtf,
  BsFiletypePy,
  BsFiletypeMd,
  BsFiletypeMdx,
  BsFiletypeCsv,
  BsFiletypeBmp
} from 'react-icons/bs';

import { AiOutlineApple } from 'react-icons/ai';
import { IconBaseProps } from 'react-icons';
import { FC } from 'react';

const fileTypeIcons = {
  pdf: <BsFiletypePdf size={50} className="text-red-700 mb-3" />,
  doc: <BsFiletypeDoc size={50} className="text-blue-600 mb-3" />,
  docx: <BsFiletypeDocx size={50} className="text-blue-600 mb-3" />,
  xls: <BsFiletypeXls size={50} className="text-green-500 mb-3" />,
  xlsx: <BsFiletypeXlsx size={50} className="text-green-500 mb-3" />,
  csv: <BsFiletypeCsv size={50} className="text-green-500 mb-3" />,
  bmp: <BsFiletypeBmp size={50} className="text-green-500 mb-3" />,
  ppt: <BsFiletypePpt size={50} className="text-red-700 mb-3" />,
  pptx: <BsFiletypePptx size={50} className="text-red-700 mb-3" />,
  txt: <BsFiletypeTxt size={50} className="text-orange-600 mb-3" />,
  jpg: <BsFiletypeJpg size={50} className="text-orange-600 mb-3" />,
  jpeg: <BsFiletypeJpg size={50} className="text-orange-600 mb-3" />,
  png: <BsFiletypePng size={50} className="text-orange-600 mb-3" />,
  webp: <BsFileEarmarkEasel size={50} className="text-orange-600 mb-3" />,
  svg: <BsFiletypeSvg size={50} className="text-orange-600 mb-3" />,
  gif: <BsFiletypeGif size={50} className="text-orange-600 mb-3" />,
  mp3: <BsFiletypeMp3 size={50} className="text-orange-500 mb-3" />,
  wav: <BsFiletypeWav size={50} className="text-orange-500 mb-3" />,
  mp4: <BsFiletypeMp4 size={50} className="text-green-400 mb-3" />,
  mov: <BsFiletypeMov size={50} className="text-green-400 mb-3" />,
  zip: <BsFileEarmarkZip size={50} className="text-pink-500 mb-3" />,
  rar: <BsFileEarmarkZip size={50} className="text-pink-500 mb-3" />,
  gz: <BsFileEarmarkZip size={50} className="text-pink-500 mb-3" />,
  html: <BsFiletypeHtml size={50} className="text-orange-400 mb-3" />,
  css: <BsFiletypeCss size={50} className="text-sky-500 mb-3" />,
  sass: <BsFiletypeSass size={50} className="text-pink-400 mb-3" />,
  sh: <BsFiletypeSh size={50} className="text-red-400 mb-3" />,
  otf: <BsFiletypeOtf size={50} className="text-red-400 mb-3" />,
  js: <BsFiletypeJs size={50} className="text-yellow-400 mb-3" />,
  ts: <BsFiletypeTsx size={50} className="text-blue-600 mb-3" />,
  tsx: <BsFiletypeTsx size={50} className="text-blue-600 mb-3" />,
  jsx: <BsFiletypeJsx size={50} className="text-sky-600 mb-3" />,
  py: <BsFiletypePy size={50} className="text-sky-600 mb-3" />,
  md: <BsFiletypeMd size={50} className="text-sky-600 mb-3" />,
  mdx: <BsFiletypeMdx size={50} className="text-purple-600 mb-3" />,
  json: <BsFiletypeJson size={50} className="text-amber-500 mb-3" />,
  php: <BsFiletypePhp size={50} className="text-blue-500 mb-3" />,
  psd: <BsFiletypePsd size={50} className="text-red-700 mb-3" />,
  ai: <BsFiletypeAi size={50} className="text-orange-500 mb-3" />,
  xml: <BsFiletypeXml size={50} className="text-green-400 mb-3" />,
  bin: <BsFileBinary size={50} className="text-amber-800 mb-3" />,
  exe: <BsFiletypeExe size={50} className="text-amber-800 mb-3" />,
  icloud: <AiOutlineApple size={50} className="text-gray-300 mb-3" />,
  au: <BsFileEarmarkBinary size={50} className="text-orange-500 mb-3" />,
  vst: <BsFileEarmarkBinary size={50} className="text-orange-500 mb-3" />,
  // Default icon for unknown file types
  default: <BsFileEarmarkText size={50} className="text-pink-400 mb-3" />
};

export type Extension = keyof typeof fileTypeIcons;

type IconProps = IconBaseProps & {
  ext: Extension;
};

const FileIcon: FC<IconProps> = ({ ext }) => {
  const Icon = fileTypeIcons[ext] || fileTypeIcons['default'];
  return Icon;
};

export default FileIcon;

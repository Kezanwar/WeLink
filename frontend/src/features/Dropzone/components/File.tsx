import { FC, useMemo } from 'react';
import { IconBaseProps } from 'react-icons';
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

import ProgressBar from '@app/components/ProgressBar';
import useFileStore from '@app/stores/file';
import cc from '@app/util/cc';
import formatBytes from '@app/util/format-bytes';

const fileTypeIcons = {
  pdf: <BsFiletypePdf size={40} className="text-red-700 mb-3" />,
  doc: <BsFiletypeDoc size={40} className="text-blue-600 mb-3" />,
  docx: <BsFiletypeDocx size={40} className="text-blue-600 mb-3" />,
  xls: <BsFiletypeXls size={40} className="text-green-500 mb-3" />,
  xlsx: <BsFiletypeXlsx size={40} className="text-green-500 mb-3" />,
  csv: <BsFiletypeCsv size={40} className="text-green-500 mb-3" />,
  bmp: <BsFiletypeBmp size={40} className="text-green-500 mb-3" />,
  ppt: <BsFiletypePpt size={40} className="text-red-700 mb-3" />,
  pptx: <BsFiletypePptx size={40} className="text-red-700 mb-3" />,
  txt: <BsFiletypeTxt size={40} className="text-orange-600 mb-3" />,
  jpg: <BsFiletypeJpg size={40} className="text-orange-600 mb-3" />,
  jpeg: <BsFiletypeJpg size={40} className="text-orange-600 mb-3" />,
  png: <BsFiletypePng size={40} className="text-orange-600 mb-3" />,
  webp: <BsFileEarmarkEasel size={40} className="text-orange-600 mb-3" />,
  svg: <BsFiletypeSvg size={40} className="text-orange-600 mb-3" />,
  gif: <BsFiletypeGif size={40} className="text-orange-600 mb-3" />,
  mp3: <BsFiletypeMp3 size={40} className="text-orange-500 mb-3" />,
  wav: <BsFiletypeWav size={40} className="text-orange-500 mb-3" />,
  mp4: <BsFiletypeMp4 size={40} className="text-green-400 mb-3" />,
  mov: <BsFiletypeMov size={40} className="text-green-400 mb-3" />,
  zip: <BsFileEarmarkZip size={40} className="text-pink-500 mb-3" />,
  rar: <BsFileEarmarkZip size={40} className="text-pink-500 mb-3" />,
  gz: <BsFileEarmarkZip size={40} className="text-pink-500 mb-3" />,
  html: <BsFiletypeHtml size={40} className="text-orange-400 mb-3" />,
  css: <BsFiletypeCss size={40} className="text-sky-500 mb-3" />,
  sass: <BsFiletypeSass size={40} className="text-pink-400 mb-3" />,
  sh: <BsFiletypeSh size={40} className="text-red-400 mb-3" />,
  otf: <BsFiletypeOtf size={40} className="text-red-400 mb-3" />,
  js: <BsFiletypeJs size={40} className="text-yellow-400 mb-3" />,
  ts: <BsFiletypeTsx size={40} className="text-blue-600 mb-3" />,
  tsx: <BsFiletypeTsx size={40} className="text-blue-600 mb-3" />,
  jsx: <BsFiletypeJsx size={40} className="text-sky-600 mb-3" />,
  py: <BsFiletypePy size={40} className="text-sky-600 mb-3" />,
  md: <BsFiletypeMd size={40} className="text-sky-600 mb-3" />,
  mdx: <BsFiletypeMdx size={40} className="text-purple-600 mb-3" />,
  json: <BsFiletypeJson size={40} className="text-amber-500 mb-3" />,
  php: <BsFiletypePhp size={40} className="text-blue-500 mb-3" />,
  psd: <BsFiletypePsd size={40} className="text-red-700 mb-3" />,
  ai: <BsFiletypeAi size={40} className="text-orange-500 mb-3" />,
  xml: <BsFiletypeXml size={40} className="text-green-400 mb-3" />,
  bin: <BsFileBinary size={40} className="text-amber-800 mb-3" />,
  exe: <BsFiletypeExe size={40} className="text-amber-800 mb-3" />,
  icloud: <AiOutlineApple size={50} className="text-gray-300 mb-3" />,
  au: <BsFileEarmarkBinary size={40} className="text-orange-500 mb-3" />,
  vst: <BsFileEarmarkBinary size={40} className="text-orange-500 mb-3" />,
  // Default icon for unknown file types
  default: <BsFileEarmarkText size={40} className="text-pink-400 mb-3" />
};

type Extension = keyof typeof fileTypeIcons;

type IconProps = IconBaseProps & {
  ext: Extension;
};

const FileIcon: FC<IconProps> = ({ ext }) => {
  const Icon = fileTypeIcons[ext] || fileTypeIcons['default'];
  return Icon;
};

const File = () => {
  const { file, isProcessing, processingProgress } = useFileStore();

  const ext: Extension = useMemo(() => {
    const txtArr = file?.name.split('.');

    return txtArr?.[txtArr.length - 1].toLowerCase() as Extension;
  }, [file]);

  return file ? (
    <>
      <div
        className={cc([
          'h-full w-full flex flex-col items-center justify-center ',
          isProcessing && 'opacity-30'
        ])}
      >
        <FileIcon ext={ext} />
        <p className="text-lg text-black mb-2 dark:text-white">{file?.name}</p>
        <p className="text-sm text-gray-400">{formatBytes(file?.size)}</p>
      </div>
      <div className="h-[40px]">
        {isProcessing && (
          <>
            <ProgressBar progress={processingProgress} />
            <p className="text-sm text-gray-400 mt-2">Checking file...</p>
          </>
        )}
      </div>
    </>
  ) : null;
};

export default File;

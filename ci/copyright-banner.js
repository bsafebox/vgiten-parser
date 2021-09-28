import proPkg from '../package.json';

export const comboBannerText = (libName, libVersion) => {
  const ver = libVersion || proPkg.version || '0.0.0';
  const cpy = `2020-${new Date().getFullYear()}`;
  const author = proPkg.author || proPkg.name;
  const text = `
/**
 * ${proPkg.name || 'vgiten'} : ${libName} v${ver}
 * (c) ${cpy} by ${author}, All rights reserved.
 */
`;

  return text;
};

import { supabase } from './supabaseClient'

async function uploadImg(file: File) {
  if (!file || typeof file === 'string') return file;

  const fileName = `photos/${Date.now()}_${file.name}`;

  const { data, error } = await supabase.storage
    .from('syntax2')
    .upload(fileName, file);

  if (error) {
    console.error('Error subiendo:', error.message);
    return '';
  }

  const { data: urlData } = supabase.storage
    .from('syntax2')
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}

async function uploadVid(file: File) {
  if (!file || typeof file === 'string') return file;

  const fileName = `videos/${Date.now()}_${file.name}`;

  const { data, error } = await supabase.storage
    .from('syntax2')
    .upload(fileName, file);

  if (error) {
    console.error('Error subiendo:', error.message);
    return '';
  }

  const { data: urlData } = supabase.storage
    .from('syntax2')
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}

export { uploadImg, uploadVid };
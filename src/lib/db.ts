import { supabase } from './supabase';
import {
  Profile,
  Education,
  Experience,
  Project,
  Certification,
  Skill,
  Resume,
  Message,
} from './types';

// ==========================================
// PUBLIC FETCHING METHODS
// ==========================================

export async function getProfile(): Promise<Profile | null> {
  try {
    const { data, error } = await supabase.from('profiles').select('*').maybeSingle();
    if (error) {
      console.error('Supabase getProfile Error:', error.message, error.code, error.details, error.hint);
      return null;
    }
    console.log('PROFILE DATA:', data);
    return data || null;
  } catch (err) {
    console.error('getProfile unexpected error:', err);
    return null;
  }
}


export async function getEducation(): Promise<Education[]> {
  try {
    const { data, error } = await supabase
      .from('education')
      .select('*');

    if (error) {
      console.error(
        'Error fetching education:',
        JSON.stringify(error, null, 2)
      );
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Unexpected Error:', err);
    return [];
  }
}

export async function getExperience(): Promise<Experience[]> {
  const { data, error } = await supabase
    .from('experience')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) {
    console.error('Error fetching experience:', error);
    return [];
  }
  return data || [];
}

export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
  return data || [];
}

export async function getCertifications(): Promise<Certification[]> {
  const { data, error } = await supabase
    .from('certifications')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) {
    console.error('Error fetching certifications:', error);
    return [];
  }
  return data || [];
}

export async function getSkills(): Promise<Skill[]> {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) {
    console.error('Error fetching skills:', error);
    return [];
  }
  return data || [];
}

export async function getResumes(): Promise<Resume[]> {
  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching resumes:', error);
    return [];
  }
  return data || [];
}

export async function getActiveResume(): Promise<Resume | null> {
  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('is_active', true)
    .limit(1);
  if (error) {
    console.error('Error fetching active resume:', error);
    return null;
  }
  return data && data.length > 0 ? data[0] : null;
}

// ==========================================
// ADMIN MUTATION METHODS (WRITE/EDIT/DELETE)
// ==========================================

export async function updateProfile(profile: any): Promise<any> {
  try {
    // If the ID is a dummy string UUID, map it to the database default ID (1)
    let profileId = profile.id;
    if (typeof profileId === 'string' && (profileId.includes('-') || isNaN(Number(profileId)))) {
      profileId = 1;
    } else {
      profileId = Number(profileId) || 1;
    }

    const { data, error } = await supabase
      .from("profiles")
      .update({
        name: profile.name,
        title: profile.title,
        about: profile.about,
        avatar_url: profile.avatar_url,
        github_url: profile.github_url,
        linkedin_url: profile.linkedin_url,
        email: profile.email,
        phone: profile.phone,
        location: profile.location,
        background_url: profile.background_url,
      })
      .eq("id", profileId)
      .select();

    if (error) {
      console.error("FULL ERROR:", JSON.stringify(error, null, 2));
      return null;
    }

    console.log("UPDATED:", data);
    return data;
  } catch (err) {
    console.error("CATCH ERROR:", err);
    return null;
  }
}

// Legacy updateProfile logic removed – using the new implementation above

// Education CRUD
export async function upsertEducation(edu: Omit<Education, 'id'> & { id?: string }): Promise<boolean> {
  const payload = { ...edu };
  if (payload.id && String(payload.id).startsWith('edu-')) {
    delete payload.id;
  } else if (payload.id && !isNaN(Number(payload.id)) && String(payload.id).trim() !== '') {
    // @ts-ignore
    payload.id = Number(payload.id);
  }
  const { error } = await supabase.from('education').upsert(payload);
  if (error) {
    console.error('Error saving education:', error);
    return false;
  }
  return true;
}

export async function deleteEducation(id: string): Promise<boolean> {
  const cleanId = isNaN(Number(id)) ? id : Number(id);
  const { error } = await supabase.from('education').delete().eq('id', cleanId);
  if (error) {
    console.error('Error deleting education:', error);
    return false;
  }
  return true;
}

// Experience CRUD
export async function upsertExperience(exp: Omit<Experience, 'id'> & { id?: string }): Promise<boolean> {
  const payload = { ...exp };
  if (payload.id && String(payload.id).startsWith('exp-')) {
    delete payload.id;
  } else if (payload.id && !isNaN(Number(payload.id)) && String(payload.id).trim() !== '') {
    // @ts-ignore
    payload.id = Number(payload.id);
  }

  // Convert date fields to YYYY-MM-DD or null if blank/invalid, since Postgres experience columns are 'date' type.
  const parseDate = (d?: string | null) => {
    if (!d || d.trim() === '' || d.toLowerCase() === 'present') return null;
    const dateObj = new Date(d);
    if (!isNaN(dateObj.getTime())) {
      return dateObj.toISOString().split('T')[0];
    }
    return null;
  };

  payload.start_date = parseDate(payload.start_date) || new Date().toISOString().split('T')[0];
  payload.end_date = parseDate(payload.end_date);

  const { error } = await supabase.from('experience').upsert(payload);
  if (error) {
    console.error('Error saving experience FULL DETAILS:', JSON.stringify(error, null, 2));
    return false;
  }
  return true;
}

export async function deleteExperience(id: string): Promise<boolean> {
  const cleanId = isNaN(Number(id)) ? id : Number(id);
  const { error } = await supabase.from('experience').delete().eq('id', cleanId);
  if (error) {
    console.error('Error deleting experience:', error);
    return false;
  }
  return true;
}

// Project CRUD
export async function upsertProject(proj: Omit<Project, 'id'> & { id?: string }): Promise<{success: boolean, errorMsg?: string}> {
  const payload: any = { ...proj };
  const hasValidId = payload.id && !String(payload.id).startsWith('proj-');
  
  // Remove generated columns to avoid Postgres IDENTITY column errors
  delete payload.created_at;

  let error;
  if (hasValidId) {
    // If it's a valid existing ID, do an UPDATE and don't include the 'id' column in the payload
    const id = payload.id;
    delete payload.id;
    const { error: updateErr } = await supabase.from('projects').update(payload).eq('id', id);
    error = updateErr;
  } else {
    // If it's a new project (or has a dummy ID), do an INSERT without an ID
    delete payload.id;
    const { error: insertErr } = await supabase.from('projects').insert(payload);
    error = insertErr;
  }

  if (error) {
    console.error('Error saving project:', error);
    return { success: false, errorMsg: error.message || JSON.stringify(error) };
  }
  return { success: true };
}

export async function deleteProject(id: string): Promise<boolean> {
  const cleanId = isNaN(Number(id)) ? id : Number(id);
  const { error } = await supabase.from('projects').delete().eq('id', cleanId);
  if (error) {
    console.error('Error deleting project:', error);
    return false;
  }
  return true;
}

// Certification CRUD
export async function upsertCertification(cert: Omit<Certification, 'id'> & { id?: string }): Promise<boolean> {
  const payload = { ...cert };
  if (payload.id && String(payload.id).startsWith('cert-')) {
    delete payload.id;
  } else if (payload.id && !isNaN(Number(payload.id)) && String(payload.id).trim() !== '') {
    // @ts-ignore
    payload.id = Number(payload.id);
  }
  const { error } = await supabase.from('certifications').upsert(payload);
  if (error) {
    console.error('Error saving certification:', error);
    return false;
  }
  return true;
}

export async function deleteCertification(id: string): Promise<boolean> {
  const cleanId = isNaN(Number(id)) ? id : Number(id);
  const { error } = await supabase.from('certifications').delete().eq('id', cleanId);
  if (error) {
    console.error('Error deleting certification:', error);
    return false;
  }
  return true;
}

// Skill CRUD
export async function upsertSkill(skill: Omit<Skill, 'id'> & { id?: string }): Promise<boolean> {
  const payload = { ...skill };
  if (payload.id && String(payload.id).startsWith('sk-')) {
    delete payload.id;
  } else if (payload.id && !isNaN(Number(payload.id)) && String(payload.id).trim() !== '') {
    // @ts-ignore
    payload.id = Number(payload.id);
  }
  const { error } = await supabase.from('skills').upsert(payload);
  if (error) {
    console.error('Error saving skill:', error);
    return false;
  }
  return true;
}

export async function deleteSkill(id: string): Promise<boolean> {
  const cleanId = isNaN(Number(id)) ? id : Number(id);
  const { error } = await supabase.from('skills').delete().eq('id', cleanId);
  if (error) {
    console.error('Error deleting skill:', error);
    return false;
  }
  return true;
}

// Resume CRUD & Uploads
export async function uploadResumeFile(file: File): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = fileName; // Upload directly inside the resumes bucket, not nested resumes/resumes/

  const { error: uploadError } = await supabase.storage
    .from('resumes')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading resume file FULL DETAILS:', JSON.stringify(uploadError, null, 2));
    return null;
  }

  // Get public URL
  const { data } = supabase.storage.from('resumes').getPublicUrl(filePath);
  return data.publicUrl;
}

export async function addResume(name: string, fileUrl: string): Promise<boolean> {
  // Check if there are any existing resumes; auto-activate if this is the first one
  const { data: existing } = await supabase.from('resumes').select('id').limit(1);
  const shouldBeActive = !existing || existing.length === 0;

  const { error } = await supabase.from('resumes').insert({
    name,
    file_url: fileUrl,
    is_active: shouldBeActive,
  });
  if (error) {
    console.error('Error saving resume to database FULL DETAILS:', JSON.stringify(error, null, 2));
    return false;
  }
  return true;
}

export async function setActiveResume(id: string): Promise<boolean> {
  const numericId = Number(id);

  // Turn off is_active for all resumes
  const { error: updateAllError } = await supabase
    .from('resumes')
    .update({ is_active: false })
    .neq('id', numericId);

  if (updateAllError) {
    console.error('Error resetting resumes active status:', updateAllError);
    return false;
  }

  // Turn on is_active for this resume
  const { error: updateOneError } = await supabase
    .from('resumes')
    .update({ is_active: true })
    .eq('id', numericId);

  if (updateOneError) {
    console.error('Error setting resume active:', updateOneError);
    return false;
  }

  return true;
}

export async function deleteResume(id: string, fileUrl: string): Promise<boolean> {
  // Extract filePath from publicUrl
  // URL looks like: https://[project].supabase.co/storage/v1/object/public/resumes/resumes/[filename]
  const urlParts = fileUrl.split('/resumes/');
  if (urlParts.length > 1) {
    const filePath = `resumes/${urlParts[1]}`;
    const { error: storageError } = await supabase.storage
      .from('resumes')
      .remove([filePath]);
    if (storageError) {
      console.warn('Warning: Storage removal failed:', storageError);
    }
  }

  const { error } = await supabase.from('resumes').delete().eq('id', id);
  if (error) {
    console.error('Error deleting resume record:', error);
    return false;
  }
  return true;
}

// Background Photo Upload
export async function uploadBackgroundImage(file: File): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  // Use existing 'avatars' bucket with a "backgrounds" folder prefix to avoid missing bucket issues
  const filePath = `backgrounds/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars') // Reusing the avatars bucket which is known to exist
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading background image:', uploadError);
    return null;
  }

  // Get public URL
  const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
  return data.publicUrl;
}

// Project Images Upload
export async function uploadProjectImage(file: File): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  // Use existing 'avatars' bucket with a "projects" folder prefix for consistency
  const filePath = `projects/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars') // Reusing the avatars bucket which is confirmed functional
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading project image:', uploadError);
    return null;
  }

  const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
  return data.publicUrl;
}

// Avatar Image Upload
export async function uploadAvatarImage(file: File): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = fileName;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading avatar image:', uploadError);
    return null;
  }

  const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
  return data.publicUrl;
}


// ==========================================
// CONTACT MESSAGES METHODS
// ==========================================

export async function submitMessage(msg: Omit<Message, 'id' | 'is_read' | 'created_at'>): Promise<boolean> {
  const { error } = await supabase.from('messages').insert(msg);
  if (error) {
    console.error('Error submitting message:', error);
    return false;
  }
  return true;
}

export async function getMessages(): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
  return data || [];
}

export async function markMessageRead(id: string, is_read: boolean): Promise<boolean> {
  const { error } = await supabase
    .from('messages')
    .update({ is_read })
    .eq('id', id);
  if (error) {
    console.error('Error updating message status:', error);
    return false;
  }
  return true;
}

export async function deleteMessage(id: string): Promise<boolean> {
  const { error } = await supabase.from('messages').delete().eq('id', id);
  if (error) {
    console.error('Error deleting message:', error);
    return false;
  }
  return true;
}

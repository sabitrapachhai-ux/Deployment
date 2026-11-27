import { useEffect,useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/client';
import AdminLayout from '../../components/layout/AdminLayout';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import SmartImage from '../../components/ui/SmartImage';
const labels={services:'Services',certificates:'Certificates',experience:'Experience',appreciations:'Appreciations'};
const schemas={
 services:{title:'',description:'',icon:'tool',startingPrice:'',isActive:true,order:0},
 certificates:{title:'',issuedBy:'',issueDate:'',description:'',image:'',order:0},
 experience:{role:'',organization:'',startYear:'',endYear:'',description:'',order:0},
 appreciations:{authorName:'',authorRole:'customer',message:'',rating:5,image:'',date:'',isFeatured:false},
};
function CertificateImageField({image,onChange,onUploadingChange}){
 const [uploading,setUploading]=useState(false);
 const uploadImage=async(file)=>{
  if(!file)return;
  const extensions={'image/jpeg':'jpg','image/png':'png','image/webp':'webp'};
  const extension=extensions[file.type];
  if(!extension){toast.error('Only JPG, PNG, or WebP images are allowed');return}
  if(file.size>2*1024*1024){toast.error('Image must be 2 MB or smaller');return}
  const body=new FormData();body.append('image',new File([file],`certificate.${extension}`,{type:file.type}));
  setUploading(true);onUploadingChange(true);
  try{const {data}=await api.post('/upload',body,{silent:true});onChange(data.data.url);toast.success('Certificate photo uploaded')}
  catch(error){toast.error(error.response?.data?.message||'Certificate photo upload failed')}
  finally{setUploading(false);onUploadingChange(false)}
 };
 const pasteImage=(event)=>{
  const imageItem=Array.from(event.clipboardData?.items||[]).find(item=>item.kind==='file'&&item.type.startsWith('image/'));
  if(!imageItem)return;
  const file=imageItem.getAsFile();
  if(!file){event.preventDefault();toast.error('Could not read the pasted image');return}
  event.preventDefault();
  uploadImage(file);
 };
 return <div className="grid gap-3 md:col-span-2">
  <label>Upload certificate photo<input className="field mt-1" type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" disabled={uploading} onChange={event=>{uploadImage(event.target.files?.[0]);event.target.value=''}}/><span className="mt-1 block text-sm text-muted">JPG, PNG, or WebP; maximum 2 MB.</span></label>
  <label>Or paste a photo from your clipboard<textarea className="field mt-1 min-h-20" placeholder="Click here, then press Ctrl+V to paste a certificate image" onPaste={pasteImage} disabled={uploading}/></label>
  <label>Or paste an image URL<input className="field mt-1" type="text" value={image||''} onChange={event=>onChange(event.target.value)} placeholder="https://... or /uploads/..."/></label>
  {uploading&&<p className="text-sm text-muted">Uploading certificate photo...</p>}
  {image&&<div className="flex items-center gap-3"><SmartImage src={image} alt="Certificate photo preview" fallback="certificate" className="h-28 w-40 rounded-lg border border-border object-cover"/><button className="btn btn-outline" type="button" onClick={()=>onChange('')}>Remove photo</button></div>}
 </div>;
}
export default function Content(){
 const {resource}=useParams();const [items,setItems]=useState([]);const [modal,setModal]=useState(false);const [form,setForm]=useState(schemas[resource]||{});const [editing,setEditing]=useState(null);const [remove,setRemove]=useState(null);const [imageUploading,setImageUploading]=useState(false);
 const load=()=>api.get(`/${resource}?limit=100`).then(({data})=>setItems(data.data.items||[])).catch(()=>{});
 useEffect(()=>{setItems([]);setForm(schemas[resource]||{});load()},[resource]);
 const save=async(e)=>{e.preventDefault();if(resource==='certificates'&&imageUploading)return;try{const payload={...form};if(editing)await api.put(`/${resource}/${editing._id}`,payload);else await api.post(`/${resource}`,payload);toast.success('Record saved');setModal(false);setEditing(null);setForm(schemas[resource]);load()}catch{}};
 const removeItem=async()=>{try{await api.delete(`/${resource}/${remove._id}`);toast.success('Record deleted');setRemove(null);load()}catch{}};
 const edit=(item)=>{const copy={...item};['issueDate','date','endYear','startYear'].forEach(k=>{if(copy[k]&&typeof copy[k]==='string')copy[k]=copy[k].slice(0,10)});if(item.startYear)copy.startYear=String(item.startYear);if(item.endYear)copy.endYear=String(item.endYear);setEditing(item);setForm(copy);setModal(true)};
 const fields=Object.keys(schemas[resource]||{}).filter(k=>k!=='isActive'&&k!=='isFeatured'&&!(resource==='certificates'&&k==='image'));
 return <AdminLayout><div className="flex justify-between"><h1 className="text-3xl font-bold text-primary-900">{labels[resource]}</h1><button className="btn btn-accent" onClick={()=>{setEditing(null);setForm(schemas[resource]);setModal(true)}}>Add record</button></div>{!items.length?<div className="mt-6"><EmptyState title={`No ${labels[resource]?.toLowerCase()}`} message="Add a record."/></div>:<div className="mt-6 grid gap-4 md:grid-cols-2">{items.map(item=><article className="card p-5" key={item._id}><h2 className="font-bold text-primary-900">{item.title||item.role||item.authorName}</h2><p className="text-muted">{item.issuedBy||item.organization||item.authorRole||item.description||item.message}</p><div className="mt-4 flex gap-2"><button className="btn btn-outline" onClick={()=>edit(item)}>Edit</button><button className="btn bg-danger text-white" onClick={()=>setRemove(item)}>Delete</button></div></article>)}</div>}
 <Modal open={modal} title={editing?'Edit record':'Add record'} onClose={()=>setModal(false)}><form className="grid gap-3 md:grid-cols-2" onSubmit={save}>{fields.map(key=><label key={key}>{key.replace(/([A-Z])/g,' $1')}<textarea className="field mt-1" value={form[key]??''} onChange={e=>setForm({...form,[key]:e.target.value})}/></label>)}{resource==='certificates' && <CertificateImageField image={form.image} onChange={image => setForm({...form,image})} onUploadingChange={setImageUploading} />}{'isActive' in (schemas[resource]||{})&&<label><input type="checkbox" checked={!!form.isActive} onChange={e=>setForm({...form,isActive:e.target.checked})}/> Active</label>}{'isFeatured' in (schemas[resource]||{})&&<label><input type="checkbox" checked={!!form.isFeatured} onChange={e=>setForm({...form,isFeatured:e.target.checked})}/> Featured</label>}<button className="btn btn-accent md:col-span-2" disabled={resource==='certificates'&&imageUploading}>Save record</button></form></Modal><ConfirmDialog open={!!remove} message="Delete this record?" onCancel={()=>setRemove(null)} onConfirm={removeItem}/></AdminLayout>;
}

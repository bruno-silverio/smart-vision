import { PencilIcon } from '@heroicons/react/24/outline';

export default function ButtonEdit() {
  return ( 
    <button 
      data-modal-target="crud-modal" 
      data-modal-toggle="crud-modal" 
      className="bg-blue-500 hover:bg-blue-700 text-white flex cursor-pointer items-center gap-x-2 rounded px-5 py-1.5 text-sm font-bold transition md:px-4" 
      type="button"
        
    >
      <PencilIcon className="size-6"/>
      Edit
    </button>
  );
}

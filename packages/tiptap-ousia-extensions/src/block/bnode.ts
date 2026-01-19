import {Node, mergeAttributes} from '@tiptap/core';
import {v4 as uuidv4} from 'uuid';

export const BNode = Node.create({
  name: 'bNode',
  addAttributes(){
    return {
      blockId:{
        default:()=> uuidv4(),
        parseHTML:element=> element.getAttribute('data-block-id'),
        renderHTML:attributes=> {
          return {
            'data-block-id': attributes.blockId,
          };  
        },
      },
      updatedAt:{
        default:()=> new Date().toISOString(),
        parseHTML:(element)=> element.dataset.updateAt,
        renderHTML:(attributes)=> ({
            'data-update-at': attributes.updatedAt,
        }),
      },
    };
  },
});
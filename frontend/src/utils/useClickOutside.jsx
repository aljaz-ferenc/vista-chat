import { useEffect } from "react";

export default function useClickOutside(onClickOutside, excludedElements){
    useEffect(() => {
        const handleClickOutside = (e) => {
          excludedElements.forEach(el => {
            if(el.current && !el.current.contains(e.target)){
                onClickOutside();
            }
          })
        };
    
        document.body.addEventListener("click", handleClickOutside);
    
        return () => document.body.removeEventListener("click", handleClickOutside);
      }, []);
}
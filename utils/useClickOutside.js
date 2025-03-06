import { useEffect } from "react";

/*ceamos la funcion para que al hacer click en la parte de afuera de lo que se este mostrando se cierre*/
/*creando un hook*/
export default function useClickOutside(ref, fun) {
  useEffect(() => {
    const listener = (e) => {
      if (!ref.current || ref.current.contains(e.target)) {
        return;
      }
      fun();
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref]);
}

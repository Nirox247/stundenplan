
interface props {
    text: string;
  }
  
  const copy = async ({ text }: props) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Fehler beim Kopieren:', err);
    }
  };

  export default copy;
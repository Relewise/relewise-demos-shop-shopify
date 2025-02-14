import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Category from './Category.tsx'

const element = document.getElementById('root'); // This targets the element where we inject React 

if (element) {
  const collectionId = element.dataset.collectionId; // Information needed from shopify store
  const currency = element.dataset.shopCurrency;
  const language = element.dataset.shopLanguage;

    createRoot(element!).render( // Rendering the react component if we have the information
      <StrictMode>
        {collectionId && currency && language &&
          <Category collectionId={collectionId} currency={currency} language={language} />
        }
      </StrictMode>,
    );
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Category from './Category.tsx'

const element = document.getElementById('root');

if (element) {
  const collectionId = element.dataset.collectionId;
  const currency = element.dataset.shopCurrency;
  const language = element.dataset.shopLanguage;

    createRoot(element!).render(
      <StrictMode>
        {collectionId && currency && language &&
          <Category collectionId={collectionId} currency={currency} language={language} />
        }
      </StrictMode>,
    );
}

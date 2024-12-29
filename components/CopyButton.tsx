import { useState } from 'react';

interface CopyButtonProps {
    targetId: string;
    contentType?: 'textContent' | 'innerText';
}

const CopyButton: React.FC<CopyButtonProps> = ({
    targetId,
    contentType = 'textContent'
}) => {
    const [copied, setCopied] = useState(false);

    const HandleCopy = () => {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            const content = (targetElement as HTMLElement)[contentType];
            if (content) {
                navigator.clipboard.writeText(content).then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                });
            }
        }
    };

    return (
        <button
            onClick={HandleCopy}
            className="text-[#F0BB78] hover:text-gray-200 bg-transparent hover:bg-[#2d2d2d] rounded-lg p-2 inline-flex items-center justify-center transition-colors duration-200"
            data-copy-to-clipboard-target={targetId}
            data-copy-to-clipboard-content-type={contentType}
        >
            <span id={`default-icon-${targetId}`} className={copied ? 'hidden' : ''}>
                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                    <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
                </svg>
            </span>
            <span id={`success-icon-${targetId}`} className={copied ? 'inline-flex items-center' : 'hidden'}>
                <svg className="w-4 h-4 text-[#F0BB78]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5" />
                </svg>
            </span>
        </button>
    );
};

export default CopyButton;

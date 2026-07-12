import ClassicTemplate from './templates/ClassicTemplate';
import ModernTemplate from './templates/ModernTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import EnhancedTemplate from './templates/EnhancedTemplate';

const TEMPLATE_MAP = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  enhanced: EnhancedTemplate,
};

// id="resume-preview-sheet" is targeted by the PDF export (html2pdf) later.
export default function ResumePreview({ template, data }) {
  const Template = TEMPLATE_MAP[template] || ClassicTemplate;

  return (
    <div className="flex justify-center bg-gray-100 p-4">
      <div
        id="resume-preview-sheet"
        className="w-full max-w-[600px] min-h-[780px] bg-white p-6 shadow-lg"
      >
        <Template data={data} />
      </div>
    </div>
  );
}

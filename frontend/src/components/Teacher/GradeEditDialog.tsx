import { Dialog } from "@mui/material";
import { Award, Loader2 } from "lucide-react";

interface GradeEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editingStudent: any;
  scoreInput: string;
  setScoreInput: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSaving: boolean;
}

const GradeEditDialog = ({
  isOpen,
  onClose,
  editingStudent,
  scoreInput,
  setScoreInput,
  onSubmit,
  isSaving,
}: GradeEditDialogProps) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
    >
      <div className="font-bold text-gray-900 text-lg border-b border-gray-50 px-6 py-4 flex items-center space-x-2">
        <Award className="w-5 h-5 text-indigo-600" />
        <span>{editingStudent?.markId ? "Edit Grade" : "Add Grade"}</span>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 p-6">
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Student Details
          </label>
          <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-3">
            <p className="text-sm font-semibold text-gray-800">
              {editingStudent?.name}
            </p>
            <p className="text-xs text-gray-500">{editingStudent?.email}</p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Mark Score (0 - 100)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            step="any"
            required
            value={scoreInput}
            onChange={(e) => setScoreInput(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors text-sm"
            placeholder="e.g. 85"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 border border-gray-200 text-sm font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-all cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-100 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>
              {isSaving
                ? "Saving..."
                : editingStudent?.markId
                ? "Save Changes"
                : "Submit Grade"}
            </span>
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default GradeEditDialog;

import { useSessionKeyManagerStore, DeletionState } from '../../stores/sessionKeyManager.store';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';

export default function SessionKeyTrashProgress() {
    const { deletionState, resetDeletionState } = useSessionKeyManagerStore();

    const steps = [
        'Withdrawing funds',
        'Removing key',
        'Clearing data',
        'Session Closed Successfully',
    ];

    const getCurrentStepIndex = () => {
        switch (deletionState) {
            case DeletionState.IDLE:
                return -1;
            case DeletionState.ACTIVE:
            case DeletionState.WITHDRAWING:
                return 0;
            case DeletionState.DELETING:
                return 1;
            case DeletionState.COMPLETED:
                return 3;
            case DeletionState.ERROR:
                return -1;
            default:
                return -1;
        }
    };

    const getCurrentStep = () => {
        const currentIndex = getCurrentStepIndex();
        if (currentIndex === -1) return null;
        return steps[currentIndex];
    };

    const getProgressPercentage = () => {
        const currentIndex = getCurrentStepIndex();
        if (currentIndex === -1) return 0;
        return ((currentIndex + 1) / steps.length) * 100;
    };

    const showResetButton =
        deletionState === DeletionState.COMPLETED || deletionState === DeletionState.ERROR;
    const currentStep = getCurrentStep();
    const progressPercentage = getProgressPercentage();

    return (
        <div className="space-y-4">
            <h6>Closing session</h6>

            {/* Progress Bar */}
            <Progress value={progressPercentage} className="w-full" />

            {/* Current Step Display */}
            {currentStep && (
                <div className="flex items-center gap-2 opacity-70">
                    <span>{currentStep}</span>
                </div>
            )}

            {/* Reset Button */}
            {showResetButton && (
                <div className="flex w-full justify-center">
                    <Button onClick={resetDeletionState} variant="secondary" size="default">
                        Go Back
                    </Button>
                </div>
            )}
        </div>
    );
}

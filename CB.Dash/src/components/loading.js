import LoadingOverlay from '@speedy4all/react-loading-overlay';
import '../style/loading.css';

export default function PageLoading(props) {
	return (
		<>
			<LoadingOverlay active={props.loading ?? false} spinner text={props.text}>
				<div class="loading-container" style={{ opacity: (props.loading ?? false) ? '1' : '0' }}></div>
			</LoadingOverlay>
		</>
	);
}
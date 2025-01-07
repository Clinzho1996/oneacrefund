// components/Modal.js

import { useEffect, useState } from "react";

const Modal = ({
	isOpen,
	onClose,
	children,
}: {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
}) => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		if (isOpen) {
			setIsVisible(true);
		} else {
			const timeout = setTimeout(() => setIsVisible(false), 100); // Matches the transition duration
			return () => clearTimeout(timeout);
		}
	}, [isOpen]);

	if (!isVisible) return null;

	if (!isOpen) return null;

	return (
		<div
			className={`modal-overlay ${isOpen ? "fade-in" : "fade-out"}`}
			onClick={onClose}>
			<div
				className={`modal-content ${isOpen ? "slide-in" : "slide-out"}`}
				onClick={(e) => e.stopPropagation()}>
				<button className="close-btn" onClick={onClose}>
					X
				</button>
				{children}
			</div>

			<style jsx>{`
				.modal-overlay {
					position: fixed;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					background: rgba(0, 0, 0, 0.8);
					display: flex;
					justify-content: center;
					align-items: center;
					transition: opacity 0.8s ease-in-out;
					z-index: 100;
				}
				.modal-content {
					background: #fff;
					padding: 2rem;
					border-radius: 8px;
					position: relative;
				}
				.fade-in {
					opacity: 1;
				}
				.fade-out {
					opacity: 0;
					transition: transform 0.8s ease-in-out, opacity 0.8s ease-in-out;
				}
				.modal-content {
					background: #fff;
					padding: 2rem;
					border-radius: 8px;
					position: relative;
					max-width: 90%;
					transition: transform 0.8s ease-in-out, opacity 0.8s ease-in-out;
				}
				.close-btn {
					position: absolute;
					top: 10px;
					right: 10px;
					background: transparent;
					border: none;
					font-size: 1.2rem;
					cursor: pointer;
				}
				@keyframes appear {
					0% {
						opacity: 0;
						transform: translateY(-10px);
					}
				}

				@keyframes disappear {
					0% {
						opacity: 0;
						transform: translateX(-10px);
					}
				}
			`}</style>
		</div>
	);
};

export default Modal;

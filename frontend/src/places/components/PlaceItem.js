import React from "react";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import Map from "../../shared/components/UIElements/Map";
import { AuthContext } from "../../shared/context/auth-context";
import "./PlaceItem.css";

function PlaceItem(props) {
	const auth = React.useContext(AuthContext);
	const [showMap, setShowMap] = React.useState(false);
	const [showConfirmModal, setShowConfirmModal] = React.useState(false);

	function openMapHandler() {
		setShowMap(true);
	}

	function closeMapHandler() {
		setShowMap(false);
	}

	function showDeleteWarningHandler() {
		setShowConfirmModal(true);
	}

	function hideDeleteWarningHandler() {
		setShowConfirmModal(false);
	}

	function confirmDeleteHandler() {
		setShowConfirmModal(false);
		console.log("Location has been deleted");
	}

	return (
		<React.Fragment>
			<Modal
				show={showMap}
				onCancel={closeMapHandler}
				header={props.address}
				contentClass={"place-item__modal-content"}
				footerClass={"place-item__modal-actions"}
				footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
			>
				<div className="map-container">
					<Map center={props.coordinates} zoom={16} />
				</div>
			</Modal>

			<Modal
				header="Are you sure?"
				show={showConfirmModal}
				onCancel={hideDeleteWarningHandler}
				footerClass="place-item__modal-actions"
				footer={
					<React.Fragment>
						<Button danger onClick={confirmDeleteHandler}>
							CONFIRM
						</Button>
						<Button inverse onClick={hideDeleteWarningHandler}>
							CANCEL
						</Button>
					</React.Fragment>
				}
			>
				<p>
					Are you sure you want to delete? (This action is
					irreversible!)
				</p>
			</Modal>

			<li className="place-item">
				<Card className="place-item__content">
					<div className="place-item__image">
						<img src={props.image} alt={props.title} />
					</div>
					<div className="place-item__info">
						<h2>{props.title}</h2>
						<h3>{props.address}</h3>
						<p>{props.description}</p>
					</div>
					<div className="place-item__actions">
						<Button inverse onClick={openMapHandler}>
							VIEW ON MAP
						</Button>
						{auth.isLoggedIn && (
							<Button to={`/places/${props.id}`}>EDIT</Button>
						)}
						{auth.isLoggedIn && (
							<Button danger onClick={showDeleteWarningHandler}>
								DELETE
							</Button>
						)}
					</div>
				</Card>
			</li>
		</React.Fragment>
	);
}

export default PlaceItem;

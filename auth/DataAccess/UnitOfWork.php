<?php

	// require_once('AccountRepository.php');
	// require_once('ActivityLogRepository.php');

	// Prior to index.php location
	require_once('DataAccess/DatabaseContext.php');
	require_once('DataAccess/GenericRepository.php');
	require_once('Model/Client.php');
	require_once('DataAccess/ClientRepository.php');

	class UnitOfWork{
		
		private $_clientRepository;

		public $clientRepository;

		public function __construct(){

			$this->_clientRepository = new ClientRepository();

			$this->clientRepository = $this->_clientRepository;

		}

		public function __destruct(){
			$this->_clientRepository = null;

			$this->clientRepository = null;

		}

	}
	
?>
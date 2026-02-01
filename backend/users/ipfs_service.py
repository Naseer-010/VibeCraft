"""
IPFS Service Module for Pinata Integration.

This module provides functionality to upload files and JSON data to IPFS
using Pinata's API, and retrieve content via IPFS gateways.
"""

import hashlib
import requests
from django.conf import settings


class PinataIPFSService:
    """Service class for interacting with Pinata IPFS."""
    
    BASE_URL = "https://api.pinata.cloud"
    
    def __init__(self):
        self.api_key = getattr(settings, 'PINATA_API_KEY', '')
        self.secret_key = getattr(settings, 'PINATA_SECRET_KEY', '')
        self.gateway = getattr(settings, 'PINATA_GATEWAY', 'https://gateway.pinata.cloud/ipfs/')
        
    @property
    def headers(self):
        """Get authentication headers for Pinata API."""
        return {
            'pinata_api_key': self.api_key,
            'pinata_secret_api_key': self.secret_key,
        }
    
    def test_authentication(self):
        """Test Pinata API authentication."""
        url = f"{self.BASE_URL}/data/testAuthentication"
        response = requests.get(url, headers=self.headers)
        return response.status_code == 200
    
    def upload_file(self, file, filename=None):
        """
        Upload a file to IPFS via Pinata.
        
        Args:
            file: File object or file-like object to upload
            filename: Optional filename for the upload
            
        Returns:
            dict: Contains 'success', 'cid', 'ipfs_url', and 'error' (if any)
        """
        url = f"{self.BASE_URL}/pinning/pinFileToIPFS"
        
        try:
            # Prepare the file for upload
            if filename is None:
                filename = getattr(file, 'name', 'file')
            
            files = {
                'file': (filename, file)
            }
            
            response = requests.post(url, headers=self.headers, files=files)
            
            if response.status_code == 200:
                data = response.json()
                cid = data.get('IpfsHash')
                return {
                    'success': True,
                    'cid': cid,
                    'ipfs_url': f"{self.gateway}{cid}",
                    'size': data.get('PinSize'),
                    'timestamp': data.get('Timestamp')
                }
            else:
                return {
                    'success': False,
                    'error': response.json().get('error', 'Unknown error'),
                    'status_code': response.status_code
                }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def upload_json(self, data, name=None):
        """
        Pin JSON data to IPFS via Pinata.
        
        Args:
            data: Dictionary to be pinned as JSON
            name: Optional name for the pin
            
        Returns:
            dict: Contains 'success', 'cid', 'ipfs_url', and 'error' (if any)
        """
        url = f"{self.BASE_URL}/pinning/pinJSONToIPFS"
        
        try:
            payload = {
                'pinataContent': data
            }
            
            if name:
                payload['pinataMetadata'] = {'name': name}
            
            headers = {
                **self.headers,
                'Content-Type': 'application/json'
            }
            
            response = requests.post(url, headers=headers, json=payload)
            
            if response.status_code == 200:
                response_data = response.json()
                cid = response_data.get('IpfsHash')
                return {
                    'success': True,
                    'cid': cid,
                    'ipfs_url': f"{self.gateway}{cid}"
                }
            else:
                return {
                    'success': False,
                    'error': response.json().get('error', 'Unknown error'),
                    'status_code': response.status_code
                }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def get_ipfs_url(self, cid):
        """Get the gateway URL for a given CID."""
        if not cid:
            return None
        return f"{self.gateway}{cid}"
    
    def unpin(self, cid):
        """
        Remove a pin from Pinata.
        
        Args:
            cid: The CID/hash to unpin
            
        Returns:
            dict: Contains 'success' and 'error' (if any)
        """
        url = f"{self.BASE_URL}/pinning/unpin/{cid}"
        
        try:
            response = requests.delete(url, headers=self.headers)
            
            if response.status_code == 200:
                return {'success': True}
            else:
                return {
                    'success': False,
                    'error': response.json().get('error', 'Unknown error'),
                    'status_code': response.status_code
                }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def verify_cid(self, cid):
        """
        Verify that a CID exists and is accessible.
        
        Args:
            cid: The CID to verify
            
        Returns:
            dict: Contains 'success', 'accessible', and metadata
        """
        url = f"{self.gateway}{cid}"
        
        try:
            # Just check if the file is accessible (HEAD request)
            response = requests.head(url, timeout=10)
            
            if response.status_code == 200:
                return {
                    'success': True,
                    'accessible': True,
                    'content_type': response.headers.get('Content-Type'),
                    'content_length': response.headers.get('Content-Length')
                }
            else:
                return {
                    'success': True,
                    'accessible': False,
                    'status_code': response.status_code
                }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }


def generate_blockchain_id(email, created_at):
    """
    Generate a unique blockchain-style ID for a user.
    
    Creates a SHA256 hash based on email and creation timestamp.
    
    Args:
        email: User's email address
        created_at: Account creation timestamp
        
    Returns:
        str: A 64-character hexadecimal hash (blockchain ID)
    """
    data = f"{email}:{created_at.isoformat()}"
    return hashlib.sha256(data.encode()).hexdigest()


# Singleton instance for easy import
ipfs_service = PinataIPFSService()


def test_pinata_connection():
    """Test function to verify Pinata connection."""
    service = PinataIPFSService()
    if service.test_authentication():
        print("✅ Pinata authentication successful!")
        return True
    else:
        print("❌ Pinata authentication failed. Check your API keys.")
        return False

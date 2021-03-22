package service;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ebarapp.ebar.model.Bar;
import com.ebarapp.ebar.model.Bill;
import com.ebarapp.ebar.model.ItemMenu;
import com.ebarapp.ebar.repository.BarRepository;
import com.ebarapp.ebar.repository.BillRepository;

@Service
public class BillService {

	@Autowired
	private BillRepository billRepository;
	private BarRepository barRepository;

	public Bill createBill(Bill newBill) {
		return billRepository.save(newBill);
	}

	public Bill getBillById(Long id) {
		return billRepository.findById(id).get();
	}

	public void removeBill(Long id) {
		billRepository.deleteById(id);
	}
	
	public void addOrder(Long idOrder, Long idBill, Long idBar) {
		Bill c = getBillById(idBill);
		Bar b = barRepository.findById(idBar).get();
		Set<ItemMenu> itemsMenu = new HashSet<ItemMenu>();
		
	}
}
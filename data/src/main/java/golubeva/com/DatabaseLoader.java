
package golubeva.com;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;


// tag::code[]
@Component
public class DatabaseLoader implements CommandLineRunner {

	private final SourceRepository repository;

	@Autowired
	public DatabaseLoader(SourceRepository repository) {
		this.repository = repository;
	}

	@Override
	public void run(String... strings) throws Exception {
		this.repository.save(new Source("AAA", "1.02"));
		this.repository.save(new Source("AAB", "1.5"));
		this.repository.save(new Source("AAC", "2"));
		this.repository.save(new Source("AAD", "2"));
		this.repository.save(new Source("AAE", "1.9"));
		this.repository.save(new Source("AAF", "1.53"));
		this.repository.save(new Source("AAG", "1.6"));
		this.repository.save(new Source("AAH", "1.46"));
		this.repository.save(new Source("AAI", "1.01"));
		this.repository.save(new Source("AAJ", "1.08"));
	}
}
// end::code[]